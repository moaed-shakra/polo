"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-t border-neutral-200 bg-white"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-ppsupply text-neutral-600">
              © {new Date().getFullYear()} Open Operator
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="https://browserbase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-ppsupply text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Browserbase
            </Link>
            <Link
              href="https://stagehand.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-ppsupply text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Stagehand
            </Link>
            <Link
              href="https://github.com/browserbase/open-operator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-ppsupply text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </div>
    </motion.footer>
  );
} 