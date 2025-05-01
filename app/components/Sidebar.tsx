"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 0 }}
      className="h-screen border-r border-neutral-200 bg-[#fafafa] flex flex-col overflow-hidden"
    >
      {/* Top Section */}
      <div className="p-4">
        {/* Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* New Task Button */}
        <button className="w-full mt-4 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-left font-ppsupply text-sm text-neutral-600 hover:border-neutral-300 transition-colors flex items-center justify-between group">
          <span>+ New task</span>
          <span className="text-xs text-neutral-400 group-hover:text-neutral-600">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-2">
          {/* Example Task */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-white rounded-lg border border-neutral-200 cursor-pointer hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-ppsupply text-neutral-600">🤖</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-ppsupply text-neutral-900 truncate">
                  Build AI Assistant
                </h3>
                <p className="text-xs text-neutral-500 truncate">
                  You don't have enough credits to continue...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 