import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-[color:var(--color-background)] text-[color:var(--color-dark-text)] min-h-screen py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-[color:var(--color-primary)] shadow-lg  rounded-2xl p-8 transition-colors duration-300">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[color:var(--color-accent)] mb-6">
          Privacy Policy
        </h1>
        <p className="text-[color:var(--color-subtext)] mb-8">
          Last updated: September 2025
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            1. Information We Collect
          </h2>
          <p className="leading-relaxed">
            We collect personal information such as your name, email, phone
            number, and shipping address when you create an account or place an
            order. We may also collect non-personal data like browser type,
            device, and IP address.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            2. How We Use Your Information
          </h2>
          <p className="leading-relaxed">
            Your information is used to process orders, improve our services,
            personalize your shopping experience, and send you updates about our
            products, offers, and promotions.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            3. Sharing of Data
          </h2>
          <p className="leading-relaxed">
            We do not sell your personal data. However, we may share necessary
            information with trusted third-party partners (like payment
            providers and shipping companies) to fulfill your order.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            4. Data Security
          </h2>
          <p className="leading-relaxed">
            We implement strong security measures to protect your personal
            information. However, no method of transmission over the internet is
            100% secure, so we cannot guarantee absolute security.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            5. Your Rights
          </h2>
          <p className="leading-relaxed">
            You can access, update, or delete your personal information anytime
            by logging into your account or contacting our support team.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            6. Cookies and Tracking
          </h2>
          <p className="leading-relaxed">
            Our website uses cookies and similar tracking technologies to
            enhance your browsing experience.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[color:var(--color-accent)] mb-3">
            7. Changes to Privacy Policy
          </h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-10">
          <p className="text-[color:var(--color-subtext)] text-sm">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <span className="text-[color:var(--color-accent)] font-medium hover:text-[color:var(--color-primary)] transition-colors">
              support@gadgetshop.com
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
