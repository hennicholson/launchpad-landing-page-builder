"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BentoGridShowcaseProps {
  items: Array<{
    content: React.ReactNode
    gridClass?: string
  }>
  className?: string
}

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
}

// Default grid class pattern for smart layout
function getDefaultGridClass(index: number, totalItems: number): string {
  // First item gets tall left slot (spans 2 rows)
  if (index === 0) {
    return "md:col-span-1 md:row-span-2"
  }

  // Last item spans 2 columns if totalItems makes it fit the pattern
  // (e.g., 6 items: last one spans 2 cols to fill the bottom row)
  if (index === totalItems - 1 && totalItems % 3 === 0) {
    return "md:col-span-2 md:row-span-1"
  }

  // All other items get standard size
  return "md:col-span-1 md:row-span-1"
}

export function BentoGridShowcase({ items, className }: BentoGridShowcaseProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "grid w-full grid-cols-1 gap-6 md:grid-cols-3",
        "auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={item.gridClass || getDefaultGridClass(index, items.length)}
        >
          {item.content}
        </motion.div>
      ))}
    </motion.section>
  )
}
