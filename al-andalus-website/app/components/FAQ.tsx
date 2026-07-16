"use client";

import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import type { FaqItem } from "@/lib/faq";
import { getSiteCopy } from "@/lib/copy";
import { useLocale } from "./LocaleProvider";
import { FaqPro } from "@/app/components/ui/faq-pro";

type FAQProps = {
  items: FaqItem[];
};

export default function FAQ({ items }: FAQProps) {
  const { locale } = useLocale();
  const siteCopy = getSiteCopy(locale);
  const { label, title } = siteCopy.faq;

  const subtitle = locale === "ar"
    ? "تجد هنا إجابات على الأسئلة الأكثر شيوعاً حول منتجاتنا التأمينية، وخيارات التغطية، وعمليات الشركة."
    : "Find answers to the most frequently asked questions about our insurance products, coverage options, and company operations.";

  return (
    <section className="faq" id="faq">
      <div className="faq__container">
        <div className="faq__wrapper space-y-12">
          {/* Header */}
          <div className="faq__header">
            <ScrollReveal className="faq__label-reveal">
              <p className="faq__label">{label}</p>
            </ScrollReveal>
            <AnimatedHeadline title={title} className="faq__title" />
            <ScrollReveal delay={1}>
              <p className="faq__subtitle">
                {subtitle}
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={1} className="w-full">
            <FaqPro
              items={items.map((item, index) => ({
                id: `faq-${index}`,
                question: item.question,
                answer: item.answer,
              }))}
              className="w-full"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
