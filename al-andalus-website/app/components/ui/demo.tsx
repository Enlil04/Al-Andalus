"use client";

import { FaqPro, type FaqProItem } from "@/app/components/ui/faq-pro";

const items: FaqProItem[] = [
  {
    id: "what-is-iconiq",
    question: "What is Iconiq?",
    answer: "Iconiq is an open-source library of motion-powered React components built around the shadcn registry workflow. Browse polished UI primitives, install them as local files, and adapt them inside your own codebase.",
  },
  {
    id: "install-iconiq",
    question: "How do I install an Iconiq component?",
    answer: "Install components with shadcn using commands like npx shadcn@latest add @iconiq/b-button, or use a direct registry URL from iconiqui.com/r/b-button.json.",
  },
  {
    id: "iconiq-free",
    question: "Is Iconiq free to use?",
    answer: "Yes. Iconiq is open source and free to use for personal and commercial projects.",
  }
];

export function FaqProPreview() {
  return <FaqPro className="w-full" defaultOpenFirst items={items} />;
}

export default FaqProPreview;
