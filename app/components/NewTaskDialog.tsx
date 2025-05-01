"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandInput } from "@/components/ui/command";
import { useState } from "react";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (message: string) => void;
}

export function NewTaskDialog({ open, onOpenChange, onSubmit }: NewTaskDialogProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (message: string = input) => {
    if (message.trim()) {
      onSubmit?.(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="text-center font-ppneue">Create a New Task</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            value={input}
            onValueChange={setInput}
            placeholder="What would you like Polo to help you with?" 
            className="h-14 font-ppsupply"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </Command>
        <div className="mt-4">
          <p className="text-sm text-neutral-500 font-ppsupply">
            Examples:
          </p>
          <div className="mt-2 grid gap-2">
            {[
              "Create a personal website for my photography portfolio",
              "Help me analyze my company's sales data",
              "Build a simple todo app with React",
              "Design a logo for my new startup"
            ].map((example) => (
              <button
                key={example}
                className="text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md font-ppsupply transition-colors"
                onClick={() => handleSubmit(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 