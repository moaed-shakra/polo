"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  author: string;
}

export default function ProjectCard({ title, description, image, author }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden"
    >
      <Link href="#" className="block">
        {/* Image */}
        <div className="relative h-48 bg-neutral-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-ppneue text-neutral-900 mb-2">{title}</h3>
          <p className="text-sm font-ppsupply text-neutral-600 mb-4">{description}</p>
          
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-xs font-ppsupply text-neutral-600">
                {author.split(" ").map(name => name[0]).join("")}
              </span>
            </div>
            <span className="text-sm font-ppsupply text-neutral-600">{author}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 