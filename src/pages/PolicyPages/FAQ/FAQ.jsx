import React, { useState } from "react";
import { ChevronRight, ChevronDown, X } from "lucide-react";

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openQuestion, setOpenQuestion] = useState(null);

  // Sidebar Categories
  const categories = [
    "General",
    "Support",
    "Gadget",
    "Miscellaneous",
    "Donsectetur",
    "Gabitasse",
  ];

  // FAQs by Category
  const faqData = {
    General: [
      {
        question: "What types of electronics do you sell?",
        answer:
          "We sell a wide range of electronic gadgets including smartwatches, headphones, speakers, and computer accessories.",
      },
      {
        question: "Do you offer free delivery?",
        answer:
          "Yes, we offer free delivery on all orders above 1000 taka within Bangladesh.",
      },
      {
        question: "Can I cancel my order after payment?",
        answer:
          "Yes, you can cancel your order within 24 hours of purchase for a full refund.",
      },
    ],
    Support: [
      {
        question: "How can I contact the support team?",
        answer:
          "You can reach our support team via email at support@techlight.com or call 01800-123456.",
      },
      {
        question: "What is the response time for support?",
        answer:
          "Our average response time is within 2–6 hours during working days.",
      },
      {
        question: "Do you provide after-sales service?",
        answer:
          "Yes, we provide full technical support and repair services for all our gadgets.",
      },
    ],
    Gadget: [
      {
        question: "How long does the battery last on average?",
        answer:
          "Most of our gadgets offer 8–12 hours of usage on a single charge, depending on the model.",
      },
      {
        question: "Are the gadgets water-resistant?",
        answer:
          "Many of our latest gadgets are IP67 or IP68 rated, meaning they are dustproof and water-resistant.",
      },
      {
        question: "Can I connect multiple devices at once?",
        answer:
          "Yes, some Bluetooth-enabled devices allow multi-device pairing for easy switching.",
      },
    ],
    Miscellaneous: [
      {
        question: "Do you have any loyalty programs?",
        answer:
          "Yes, registered customers earn reward points for every purchase that can be used for discounts later.",
      },
      {
        question: "Can I get student discounts?",
        answer:
          "Yes! We offer a 10% student discount on selected electronic items with a valid ID card.",
      },
    ],
    Donsectetur: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept bKash, Nagad, Rocket, and all major debit/credit cards.",
      },
      {
        question: "Do you ship outside Bangladesh?",
        answer:
          "Currently, we deliver only within Bangladesh but plan to expand soon.",
      },
    ],
    Gabitasse: [
      {
        question: "Is there any warranty on accessories?",
        answer:
          "Yes, all accessories come with a 6-month replacement warranty.",
      },
      {
        question: "Do you sell refurbished gadgets?",
        answer:
          "Yes, we offer certified refurbished gadgets with up to 30% discounts.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-10 grid md:grid-cols-2 gap-10 border border-white/50">
        {/* LEFT SIDEBAR */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Our electronics platform is designed to make your life smarter.
            Choose a category below to find quick answers to common questions.
          </p>

          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenQuestion(null);
                }}
                className={`flex items-center justify-between px-5 py-3 rounded-xl text-left font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white shadow text-blue-600"
                    : "bg-transparent hover:bg-white/60 text-gray-700"
                }`}
              >
                {cat}
                <ChevronRight
                  className={`transition-transform duration-300 ${
                    activeCategory === cat ? "rotate-90" : ""
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT FAQ SECTION */}
        <div className="bg-white rounded-2xl shadow-inner p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {activeCategory} Questions
          </h3>

          {faqData[activeCategory]?.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div
                onClick={() =>
                  setOpenQuestion(openQuestion === index ? null : index)
                }
                className="flex justify-between items-center cursor-pointer"
              >
                <h4 className="font-medium text-gray-800">{faq.question}</h4>
                {openQuestion === index ? (
                  <X className="text-gray-500 w-5 h-5" />
                ) : (
                  <ChevronDown className="text-gray-500 w-5 h-5" />
                )}
              </div>

              {openQuestion === index && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
