"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;
const EXPAND_SPRING = {
  type: "spring" as const,
  stiffness: 150,
  damping: 26,
  mass: 1.05,
};
const COLLAPSE_SPRING = {
  type: "spring" as const,
  stiffness: 190,
  damping: 30,
  mass: 1.1,
};

export type FaqProItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqProProps = {
  className?: string;
  defaultOpenFirst?: boolean;
  items: FaqProItem[];
  searchPlaceholder?: string;
};



function getDefaultOpenId(items: FaqProItem[], defaultOpenFirst: boolean) {
  if (defaultOpenFirst && items[0]) {
    return items[0].id;
  }

  return null;
}

type FaqProRowProps = {
  isOpen: boolean;
  item: FaqProItem;
  onToggle: () => void;
  panelId: string;
  query: string;
  triggerId: string;
};

function FaqProRow({
  isOpen,
  item,
  onToggle,
  panelId,
  triggerId,
}: Omit<FaqProRowProps, "query">) {
  return (
    <div
      style={{
        overflow: "hidden",
        borderRadius: "16px",
        backgroundColor: "#f5f7fa",
      }}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        id={triggerId}
        onClick={onToggle}
        type="button"
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px 20px",
          textAlign: "left",
          outline: "none",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: "15px",
            color: "#111",
            lineHeight: "1.5",
            letterSpacing: "-0.02em",
          }}
        >
          {item.question}
        </span>
        <ChevronDown
          aria-hidden
          style={{
            marginTop: "2px",
            width: "16px",
            height: "16px",
            flexShrink: 0,
            color: "#6d7480",
            transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <motion.div
        animate={{ height: isOpen ? "auto" : 0 }}
        aria-labelledby={triggerId}
        style={{ overflow: "hidden" }}
        id={panelId}
        initial={false}
        role="region"
        transition={{
          height: isOpen ? EXPAND_SPRING : COLLAPSE_SPRING,
        }}
      >
        <motion.div
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -6,
          }}
          aria-hidden={!isOpen}
          style={{
            padding: "0 20px 20px",
            fontSize: "14px",
            color: "#6d7480",
            lineHeight: "1.6",
          }}
          inert={isOpen ? undefined : true}
          initial={false}
          transition={{
            opacity: {
              duration: isOpen ? 0.38 : 0.2,
              ease: PANEL_EASE,
              delay: isOpen ? 0.06 : 0,
            },
            y: isOpen ? EXPAND_SPRING : COLLAPSE_SPRING,
          }}
        >
          {item.answer}
        </motion.div>
      </motion.div>
    </div>
  );
}

function FaqPro({
  className,
  defaultOpenFirst = false,
  items,
}: FaqProProps) {
  const listId = React.useId();

  const [openId, setOpenId] = React.useState<string | null>(() =>
    getDefaultOpenId(items, defaultOpenFirst)
  );

  React.useEffect(() => {
    setOpenId((current) => {
      if (!current) {
        return current;
      }

      return items.some((item) => item.id === current) ? current : null;
    });
  }, [items]);

  const toggleItem = React.useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <div
      className={cn("faq-pro-container", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        maxWidth: "672px",
        margin: "0 auto",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: 4 }}
            key={item.id}
            layout="position"
            transition={{ duration: 0.2, ease: PANEL_EASE }}
          >
            <FaqProRow
              isOpen={openId === item.id}
              item={item}
              onToggle={() => toggleItem(item.id)}
              panelId={`${listId}-${item.id}-panel`}
              triggerId={`${listId}-${item.id}-trigger`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
FaqPro.displayName = "FaqPro";

export { FaqPro };
