import { siteCopy } from "./copy/en";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = siteCopy.faq.items.map((item) => ({
  question: item.question,
  answer: item.answer,
}));
