import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQItemProps {
  item: FAQItem;
}

const FAQItem: React.FC<FAQItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold">{item.question}</span>
        <svg
          className={`w-6 h-6 transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600">
          {item.answer}
        </p>
      )}
    </div>
  );
};

const faqData: FAQItem[] = [
  {
    question: "What is Heapstart?",
    answer: "Heapstart is an e-commerce platform specifically designed for computer science students. We offer a wide range of products including textbooks, coding accessories, hardware components, and CS-themed merchandise to support and enhance your learning experience.",
  },
  {
    question: "Who can shop at Heapstart?",
    answer: "While our products are tailored for CS students, anyone can shop at Heapstart. Whether you're a student, professional, or coding enthusiast, you'll find valuable resources and products in our store.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! We offer special discounts for verified students. To access these discounts, simply register with your .edu email address and verify your student status through our verification process.",
  },
  {
    question: "What types of products do you sell?",
    answer: "We offer a variety of products including textbooks on programming languages and CS concepts, coding keyboards and accessories, Raspberry Pi and Arduino kits, CS-themed apparel and merchandise, and much more. Our catalog is constantly expanding to meet the needs of CS students.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship to select countries. Please check our shipping page for a full list of countries we serve and associated shipping costs and estimated delivery times.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be in their original condition and packaging. For textbooks and software, different conditions may apply. Please refer to our Returns page for full details.",
  },
  {
    question: "Do you offer any learning resources along with your products?",
    answer: "Yes! Many of our products come with complementary learning resources such as online tutorials, sample code repositories, or access to community forums. Check individual product descriptions for specific resources included.",
  },
];

const Faq: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <FAQItem key={index} item={faq} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
