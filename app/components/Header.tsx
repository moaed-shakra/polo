"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon.svg"
              alt="Polo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-ppneue text-neutral-900">Polo</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="https://github.com/browserbase/open-operator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-ppsupply text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={20}
                height={20}
              />
              View on GitHub
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
} 