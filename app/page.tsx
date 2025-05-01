"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ChatFeed from "./components/ChatFeed";
import { NewTaskDialog } from "./components/NewTaskDialog";
import Image from "next/image";
import posthog from "posthog-js";

const ProjectCard = ({ title, description, image, onClick }: { 
  title: string; 
  description: string; 
  image: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
  >
    <div className="relative h-44 w-full overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col gap-2 p-4">
      <h3 className="font-ppneue text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 font-ppsupply">{description}</p>
    </div>
  </button>
);

const CategoryButton = ({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active?: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      active 
        ? "bg-gray-900 text-white" 
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Recommended", "Featured", "Life", "Work"];

  const projects = [
    {
      title: "Personal Website",
      description: "Create a modern portfolio website to showcase your work",
      image: "/project-website.png",
      categories: ["Featured", "Work"],
    },
    {
      title: "SkyWatch",
      description: "Track weather patterns and get real-time updates",
      image: "/skywatch.png",
      categories: ["Recommended", "Life"],
    },
    {
      title: "AI Journalist",
      description: "Generate news articles and blog posts with AI",
      image: "/journalist.png",
      categories: ["Featured", "Work"],
    },
    {
      title: "Task Manager",
      description: "Stay organized with a smart todo application",
      image: "/todo.png",
      categories: ["Recommended", "Life"],
    },
  ];

  const filteredProjects = projects.filter(project => 
    activeCategory === "All" || project.categories.includes(activeCategory)
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsDialogOpen(true);
      }

      if (isChatVisible && e.key === "Escape") {
        e.preventDefault();
        setIsChatVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatVisible]);

  const startChat = useCallback(
    (finalMessage: string) => {
      setInitialMessage(finalMessage);
      setIsChatVisible(true);
      setIsDialogOpen(false);

      try {
        posthog.capture("submit_message", {
          message: finalMessage,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [setInitialMessage, setIsChatVisible]
  );

  return (
    <AnimatePresence mode="wait">
      {!isChatVisible ? (
        <div className="min-h-screen bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-12">
              <h1 className="text-4xl font-ppneue font-medium mb-3">Hello Moead Shakrah</h1>
              <p className="text-xl text-gray-500 font-ppsupply">What can I do for you?</p>
            </div>

            {/* Search Bar */}
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mb-12 w-full flex items-center gap-2 px-4 py-3 text-left text-gray-500 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-1">Give Manus a task to work on...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-gray-500 bg-gray-100 rounded border">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Categories */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </CategoryButton>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  {...project}
                  onClick={() => startChat(`Help me ${project.description.toLowerCase()}`)}
                />
              ))}
            </div>
          </div>

          <NewTaskDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
            onSubmit={startChat}
          />
        </div>
      ) : (
        <ChatFeed
          initialMessage={initialMessage}
          onClose={() => setIsChatVisible(false)}
        />
      )}
    </AnimatePresence>
  );
}
