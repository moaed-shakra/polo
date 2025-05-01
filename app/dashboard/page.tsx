"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: "recommend", name: "Recommend", active: true },
  { id: "featured", name: "Featured", active: false },
  { id: "life", name: "Life", active: false },
  { id: "research", name: "Research", active: false },
  { id: "education", name: "Education", active: false },
  { id: "data-analysis", name: "Data Analysis", active: false },
  { id: "productivity", name: "Productivity", active: false },
  { id: "content-creator", name: "Content Creator", active: false },
];

const projects = [
  {
    id: 1,
    title: "Turn anything into websites!",
    description: "Create beautiful websites from any content automatically",
    image: "/project-website.png",
    author: "L. X.",
  },
  {
    id: 2,
    title: "Web App for Night Sky Events",
    description: "Track and discover celestial events in your area",
    image: "/skywatch.png",
    author: "B. K.",
  },
  {
    id: 3,
    title: "Journalist Personal Website Creation",
    description: "Create a personal website for me as a journalist",
    image: "/journalist.png",
    author: "S.",
  },
  {
    id: 4,
    title: "Minimal To-Do List App",
    description: "Simple and elegant task management",
    image: "/todo.png",
    author: "M. S.",
  },
];

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("recommend");
  const [showNewTask, setShowNewTask] = useState(false);

  // Handle Ctrl+K shortcut
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setShowNewTask(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-ppneue text-neutral-900 mb-2"
          >
            Hello Moead Shakrah
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-ppsupply text-neutral-600"
          >
            What can I do for you?
          </motion.p>

          {/* New Task Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-[640px]"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Give Polo a task to work on..."
                className="w-full px-4 py-3 pr-24 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 font-ppsupply focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                onClick={() => setShowNewTask(true)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-100 rounded-md">
                  ⌘K
                </kbd>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-ppsupply transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-colors"
            >
              <Link href="#" className="block">
                <div className="relative h-48 bg-neutral-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-ppneue text-neutral-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm font-ppsupply text-neutral-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs font-ppsupply text-neutral-600">
                        {project.author.split(" ").map(name => name[0]).join("")}
                      </span>
                    </div>
                    <span className="text-sm font-ppsupply text-neutral-600">
                      {project.author}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 