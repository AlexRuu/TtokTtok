"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type AccordionItemProps = {
  value: string;
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (value: string) => void;
};

export function Accordion({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) {
  const [openItem, setOpenItem] = useState(defaultValue || "");

  const toggleItem = (value: string) => {
    setOpenItem((prev) => (prev === value ? "" : value));
  };

  return (
    <div className="rounded-md divide-y">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<AccordionItemProps>(child)) {
          return React.cloneElement(child, {
            isOpen: openItem === child.props.value,
            onToggle: toggleItem,
          });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionItem({
  value,
  title,
  children,
  isOpen = false,
  onToggle = () => {},
}: AccordionItemProps) {
  return (
    <div className="border border-[#F2DFD7] rounded-lg bg-[#FEF4EF]/60 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out mb-4">
      <button
        onClick={() => onToggle(value)}
        className="flex w-full items-center justify-between py-4 px-4 text-left text-sm font-medium hover:underline transition-all hover:cursor-pointer"
      >
        {title}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden px-4 text-sm"
          >
            <div className="py-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
