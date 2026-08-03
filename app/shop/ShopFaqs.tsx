"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Container from "@/components/layout/Container";

interface ShopFaq {
  question: string;
  answer: string;
}

export default function ShopFaqs({ faqs }: { faqs: ShopFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section className="bg-white py-8" aria-labelledby="shop-faqs-heading">
      <Container>
        <div className="rounded-[30px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:px-6">
          <h2 id="shop-faqs-heading" className="text-lg font-bold text-(--color-secondary) mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border border-(--color-border) rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-(--color-muted) transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-(--color-secondary) pr-4">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-(--color-border) pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
