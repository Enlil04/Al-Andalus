import { getSiteCopy } from "./copy";

export type FaqItem = {
  question: string;
  answer: string;
};

export function getFaqItems(locale: string): FaqItem[] {
  const siteCopy = getSiteCopy(locale);
  return siteCopy.faq.items.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
}

