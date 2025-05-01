import { NextResponse } from "next/server";
import { getClosestRegion } from "../../utils/regions";
import Browserbase from "@browserbasehq/sdk";

function validateApiKey(apiKey: string): boolean {
  return (
    apiKey.startsWith('bb_live_') || 
    apiKey.startsWith('bb_test_')
  ) && apiKey.length >= 30;
}

function debugApiKey(apiKey: string) {
  return {
    length: apiKey.length,
    firstChars: apiKey.substring(0, 8),
    lastChars: apiKey.substring(apiKey.length - 4),
    containsSpaces: apiKey.includes(' '),
    containsNewlines: apiKey.includes('\n'),
    containsCarriageReturn: apiKey.includes('\r'),
    startsWithBbLive: apiKey.startsWith('bb_live_'),
    startsWithBbTest: apiKey.startsWith('bb_test_'),
    rawFirstChars: Array.from(apiKey.substring(0, 8)).map(char => char.charCodeAt(0))
  };
}

// Initialize Browserbase SDK once
const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY!
});

async function closeSession(sessionId: string) {
  try {
    // Try to terminate the session using the raw API endpoint
    const response = await fetch(`https://api.browserbase.com/v1/sessions/${sessionId}/terminate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BROWSERBASE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(`Warning: Failed to terminate session ${sessionId}:`, error);
      // Don't throw error here, as the session might already be terminated
    } else {
      console.log(`Successfully terminated session ${sessionId}`);
    }
  } catch (error) {
    console.warn(`Warning: Error during session termination for ${sessionId}:`, error);
    // Don't throw error here either
  }
}

export async function POST(request: Request) {
  try {
    // Get timezone and region
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const region = getClosestRegion(timeZone);
    console.log("Using region:", region);

    try {
      // Create a new session with 5-minute timeout (free plan maximum)
      console.log("Creating session with 5-minute timeout...");
      const session = await bb.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
        region: region,
        timeout: 300 // 5 minutes in seconds (maximum for free plan)
      });
      console.log("Session created:", session.id);

      // Get the debug URL
      console.log("Getting debug URL...");
      const debugSession = await bb.sessions.debug(session.id);
      console.log("Debug URL obtained");

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        sessionUrl: debugSession.debuggerFullscreenUrl,
        expiresIn: 300 // Let the frontend know when the session will expire
      });
    } catch (sdkError: any) {
      console.error("SDK Error:", {
        message: sdkError.message,
        code: sdkError.code,
        response: sdkError.response,
        stack: sdkError.stack
      });
      
      throw new Error(`SDK Error: ${sdkError.message}`);
    }
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create session",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId parameter' }, { status: 400 });
    }

    console.log("Attempting to close session:", sessionId);
    await closeSession(sessionId);

    return NextResponse.json({ 
      success: true, 
      message: 'Session termination requested' 
    });
  } catch (error) {
    console.error("Error closing session:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to close session",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
