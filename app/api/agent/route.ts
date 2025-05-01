import { NextResponse } from 'next/server';
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateObject, UserContent } from "ai";
import { z } from "zod";
import { ObserveResult, Stagehand } from "@browserbasehq/stagehand";

const LLMClient = openai("gpt-4o");

type Step = {
  text: string;
  reasoning: string;
  tool: "GOTO" | "ACT" | "EXTRACT" | "OBSERVE" | "CLOSE" | "WAIT" | "NAVBACK";
  instruction: string;
};

let activeStagehand: Stagehand | null = null;

async function createNewSession() {
  const response = await fetch('http://localhost:3000/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to create new session');
  }

  const data = await response.json();
  return data;
}

async function getStagehand(sessionId: string): Promise<{ stagehand: Stagehand; newSessionId?: string }> {
  if (activeStagehand) {
    try {
      // Test if the active stagehand is still valid
      await activeStagehand.page?.evaluate(() => true);
      return { stagehand: activeStagehand };
    } catch (error) {
      console.log("Active stagehand is no longer valid, creating new one...");
      await closeSession(sessionId);
      activeStagehand = null;
    }
  }

  try {
    const stagehand = new Stagehand({
      browserbaseSessionID: sessionId,
      env: "BROWSERBASE",
      logger: (msg) => console.log(`[Stagehand] ${msg}`)
    });
    await stagehand.init();
    activeStagehand = stagehand;
    return { stagehand };
  } catch (initError: any) {
    console.error("Error in init:", initError);
    
    // Check if session is expired or not found
    if (initError.message.includes("Could not find a running session") || 
        initError.message.includes("is not running")) {
      console.log("Session expired or not found, creating new session...");
      
      // Make sure to close the old session first
      await closeSession(sessionId);
      
      const newSession = await createNewSession();
      console.log("Created new session:", newSession.sessionId);
      
      const stagehand = new Stagehand({
        browserbaseSessionID: newSession.sessionId,
        env: "BROWSERBASE",
        logger: (msg) => console.log(`[Stagehand] ${msg}`)
      });
      await stagehand.init();
      activeStagehand = stagehand;
      return { stagehand, newSessionId: newSession.sessionId };
    }
    throw initError;
  }
}

async function runStagehand(sessionId: string, operation: string, instruction?: string): Promise<{ result?: any; sessionId: string }> {
  let result;
  try {
    console.log(`Starting ${operation} operation with instruction: ${instruction}`);
    
    const { stagehand, newSessionId } = await getStagehand(sessionId);
    if (newSessionId) {
      console.log("Using new session ID:", newSessionId);
      sessionId = newSessionId;
    }

    const page = stagehand.page;
    if (!page) {
      throw new Error("Page not initialized");
    }

    try {
      switch (operation) {
        case "GOTO":
          console.log(`Navigating to: ${instruction}`);
          await page.goto(instruction!, {
            waitUntil: "commit",
            timeout: 30000,
          });
          console.log("Navigation completed");
          break;

        case "ACT":
          console.log(`Performing action: ${instruction}`);
          await page.act(instruction!);
          console.log("Action completed");
          break;

        case "EXTRACT": {
          console.log(`Extracting with instruction: ${instruction}`);
          const { extraction } = await page.extract(instruction!);
          result = extraction;
          break;
        }

        case "OBSERVE":
          console.log(`Observing with instruction: ${instruction}`);
          result = await page.observe({
            instruction,
            useAccessibilityTree: true,
          });
          break;

        case "CLOSE":
          console.log("Closing stagehand");
          if (activeStagehand) {
            await activeStagehand.close();
            activeStagehand = null;
          }
          console.log("Stagehand closed");
          break;

        case "SCREENSHOT": {
          console.log("Taking screenshot");
          const cdpSession = await page.context().newCDPSession(page);
          const { data } = await cdpSession.send("Page.captureScreenshot");
          result = data;
          break;
        }

        case "WAIT":
          console.log(`Waiting for ${instruction}ms`);
          await new Promise((resolve) =>
            setTimeout(resolve, Number(instruction))
          );
          console.log("Wait completed");
          break;

        case "NAVBACK":
          console.log("Navigating back");
          await page.goBack();
          console.log("Navigation back completed");
          break;
      }

      return { result, sessionId };
    } catch (error) {
      console.error(`Error during ${operation} operation:`, error);
      throw error;
    }
  } catch (error) {
    console.error("Operation failed:", error);
    throw error;
  }
}

async function sendPrompt({
  goal,
  sessionID,
  previousSteps = [],
  previousExtraction,
}: {
  goal: string;
  sessionID: string;
  previousSteps?: Step[];
  previousExtraction?: string | ObserveResult[];
}) {
  let currentUrl = "";

  try {
    const { stagehand } = await getStagehand(sessionID);
    if (stagehand.page) {
      currentUrl = await stagehand.page.url();
    }
  } catch (error) {
    console.error('Error getting page info:', error);
  }

  const content: UserContent = [
    {
      type: "text",
      text: `Consider the following screenshot of a web page${currentUrl ? ` (URL: ${currentUrl})` : ''}, with the goal being "${goal}".
${previousSteps.length > 0
    ? `Previous steps taken:
${previousSteps
  .map(
    (step, index) => `
Step ${index + 1}:
- Action: ${step.text}
- Reasoning: ${step.reasoning}
- Tool Used: ${step.tool}
- Instruction: ${step.instruction}
`
  )
  .join("\n")}`
    : ""
}
Determine the immediate next step to take to achieve the goal. 

Important guidelines:
1. Break down complex actions into individual atomic steps
2. For ACT commands, use only one action at a time, such as:
   - Single click on a specific element
   - Type into a single input field
   - Select a single option
3. Avoid combining multiple actions in one instruction
4. If multiple actions are needed, they should be separate steps

If the goal has been achieved, return "close".`,
    },
  ];

  // Add screenshot if navigated to a page previously
  if (previousSteps.length > 0 && previousSteps.some((step) => step.tool === "GOTO")) {
    try {
      const { result: screenshot } = await runStagehand(sessionID, "SCREENSHOT");
      if (screenshot) {
        content.push({
          type: "image",
          image: screenshot as string,
        });
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  }

  if (previousExtraction) {
    content.push({
      type: "text",
      text: `The result of the previous ${
        Array.isArray(previousExtraction) ? "observation" : "extraction"
      } is: ${previousExtraction}.`,
    });
  }

  const message: CoreMessage = {
    role: "user",
    content,
  };

  const result = await generateObject({
    model: LLMClient,
    schema: z.object({
      text: z.string(),
      reasoning: z.string(),
      tool: z.enum([
        "GOTO",
        "ACT",
        "EXTRACT",
        "OBSERVE",
        "CLOSE",
        "WAIT",
        "NAVBACK",
      ]),
      instruction: z.string(),
    }),
    messages: [message],
  });

  return {
    result: result.object,
    previousSteps: [...previousSteps, result.object],
  };
}

async function selectStartingUrl(goal: string) {
  const message: CoreMessage = {
    role: "user",
    content: [{
      type: "text",
      text: `Given the goal: "${goal}", determine the best URL to start from.
Choose from:
1. A relevant search engine (Google, Bing, etc.)
2. A direct URL if you're confident about the target website
3. Any other appropriate starting point

Return a URL that would be most effective for achieving this goal.`
    }]
  };

  const result = await generateObject({
    model: LLMClient,
    schema: z.object({
      url: z.string().url(),
      reasoning: z.string()
    }),
    messages: [message]
  });

  return result.object;
}

async function closeSession(sessionId: string) {
  try {
    // First try to close the stagehand instance if it exists
    if (activeStagehand) {
      try {
        await activeStagehand.close();
      } catch (error) {
        console.warn("Warning: Error closing active stagehand:", error);
      }
      activeStagehand = null;
    }

    // Then try to terminate the session via our API
    const response = await fetch(`http://localhost:3000/api/session?sessionId=${sessionId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      console.warn(`Warning: Failed to close session ${sessionId} via API:`, await response.text());
    }
  } catch (error) {
    console.warn("Warning: Error in closeSession:", error);
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Agent API endpoint ready' });
}

export async function POST(request: Request) {
  let currentSessionId = '';
  
  try {
    const body = await request.json();
    const { goal, sessionId, previousSteps = [], action } = body;
    currentSessionId = sessionId;

    console.log(`Processing ${action} request for session ${sessionId}`);

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId in request body' },
        { status: 400 }
      );
    }

    // Handle different action types
    switch (action) {
      case 'START': {
        if (!goal) {
          return NextResponse.json(
            { error: 'Missing goal in request body' },
            { status: 400 }
          );
        }

        // Make sure any existing session is closed before starting
        await closeSession(sessionId);

        console.log("Starting new session with goal:", goal);

        // Handle first step with URL selection
        const { url, reasoning } = await selectStartingUrl(goal);
        const firstStep = {
          text: `Navigating to ${url}`,
          reasoning,
          tool: "GOTO" as const,
          instruction: url
        };
        
        console.log("Selected starting URL:", url);
        
        try {
          const { result, sessionId: newSessionId } = await runStagehand(sessionId, "GOTO", url);
          currentSessionId = newSessionId || sessionId;
          
          console.log("Initial navigation successful");

          return NextResponse.json({ 
            success: true,
            result: firstStep,
            steps: [firstStep],
            done: false,
            sessionId: currentSessionId
          });
        } catch (error) {
          console.error("Failed to execute initial navigation:", error);
          throw error;
        }
      }

      case 'GET_NEXT_STEP': {
        if (!goal) {
          return NextResponse.json(
            { error: 'Missing goal in request body' },
            { status: 400 }
          );
        }

        console.log("Getting next step for goal:", goal);

        // Get the next step from the LLM
        const { result, previousSteps: newPreviousSteps } = await sendPrompt({
          goal,
          sessionID: sessionId,
          previousSteps,
        });

        console.log("Next step determined:", result);

        // If this is the final step, close the session
        if (result.tool === "CLOSE") {
          await closeSession(sessionId);
        }

        return NextResponse.json({
          success: true,
          result,
          steps: newPreviousSteps,
          done: result.tool === "CLOSE"
        });
      }

      case 'EXECUTE_STEP': {
        const { step } = body;
        if (!step) {
          return NextResponse.json(
            { error: 'Missing step in request body' },
            { status: 400 }
          );
        }

        console.log("Executing step:", step);

        try {
          // Execute the step using Stagehand
          const { result: extraction, sessionId: newSessionId } = await runStagehand(sessionId, step.tool, step.instruction);
          currentSessionId = newSessionId || sessionId;

          console.log("Step execution completed with result:", extraction);

          // If this is the final step, close the session
          if (step.tool === "CLOSE") {
            await closeSession(currentSessionId);
          }

          return NextResponse.json({
            success: true,
            extraction,
            sessionId: currentSessionId,
            done: step.tool === "CLOSE"
          });
        } catch (error) {
          console.error("Failed to execute step:", error);
          throw error;
        }
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in agent endpoint:', error);
    
    // Try to clean up the session if there's an error
    if (currentSessionId) {
      await closeSession(currentSessionId);
    }
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 