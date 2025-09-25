import React from "react";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  MessageSquare,
  Lock,
  KeyRound,
  Database,
  Users,
  CheckCircle,
  ExternalLink,
  Baby,
  RefreshCcw,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <div className="border-b border-[var(--color-subtext)]">
        <div className="container mx-auto py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-accent)] rounded-full mb-4">
            <Shield className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-accent)] mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--color-subtext)]">
            Protecting your data is our priority
          </p>
          <div className="mt-4 inline-block bg-[var(--color-primary)] px-4 py-2 rounded-full">
            <p className="text-sm text-[var(--color-subtext)]">
              Last updated: September 19, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-12 space-y-10">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="mb-4">
            This Privacy Policy describes how TechLight collects, uses, and
            protects your personal information when you use our website.
          </p>
          <div className="p-4 border-l-4 border-[var(--color-accent)] bg-[var(--color-primary)] rounded-r-lg">
            <p className="font-medium text-[var(--color-accent)]">
              By using our website, you agree to this policy.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Information We Collect</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[var(--color-accent)]" />
                Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, email, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-[var(--color-accent)]" />
                Automatically Collected
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>IP address and browser info</li>
                <li>Pages visited, time on site</li>
                <li>Device type & OS</li>
                <li>Referring website</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How We Use Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg border border-[var(--color-subtext)] text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
              <h4 className="font-semibold mb-1">Order Processing</h4>
              <p className="text-sm">Process and fulfill orders</p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--color-subtext)] text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
              <h4 className="font-semibold mb-1">Communication</h4>
              <p className="text-sm">Keep you updated</p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--color-subtext)] text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)]" />
              <h4 className="font-semibold mb-1">Security</h4>
              <p className="text-sm">Prevent fraud & ensure safety</p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
              Access your personal data
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
              Correct inaccurate data
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
              Delete your account
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
              Opt-out of marketing
            </div>
          </div>
        </section>

        {/* Third Party & Children */}
        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[var(--color-accent)]" />
              Third-Party Links
            </h2>
            <p className="text-sm">
              We may link to third-party sites. We are not responsible for their
              privacy practices.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Baby className="w-5 h-5 text-[var(--color-accent)]" />
              Children's Privacy
            </h2>
            <p className="text-sm">
              Our services are not for children under 13. We do not knowingly
              collect data from them.
            </p>
          </div>
        </section>

        {/* Policy Updates */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-[var(--color-accent)]" />
            Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. Updates will be posted
            here with a new "Last updated" date.
          </p>
        </section>

        {/* Contact Information */}
        <section className="rounded-lg p-8 text-center bg-[var(--color-accent)] text-[var(--color-primary)]">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Mail className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">support@techlight.com</p>
            </div>
            <div>
              <Phone className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">+880 1234-567890</p>
            </div>
            <div>
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">
                123 Electronics Street <br /> Dhaka 1000, Bangladesh
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
