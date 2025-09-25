import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Gavel } from "lucide-react";
import { selectTerms } from "../../../store/terms/termsSlice";

export default function TermsOfService() {
  const terms = useSelector(selectTerms);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative max-w-full mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-indigo-300/10 rounded-3xl blur-xl"></div>

      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 text-indigo-600 dark:text-indigo-400">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-2xl shadow-lg">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        {/* Terms sections */}
        <div className="space-y-8">
          {terms.map(({ title, description }, index) => (
            <section key={index}>
              <h2 className="text-xl font-bold mb-3">{title}</h2>
              <p className="text-subtext dark:text-subtext leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </section>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-accent font-semibold text-sm">
          <strong>Note:</strong> By using this platform, you agree to be legally
          bound by these terms. If you do not agree, please discontinue use of
          the site.
        </div>
      </div>
    </motion.div>
  );
}
