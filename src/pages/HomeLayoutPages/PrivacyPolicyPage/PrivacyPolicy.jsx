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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--custom-blue)] rounded-full mb-4">
            <Shield className="w-8 h-8 text-[var(--primary-foreground)]" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--custom-blue)] mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Protecting your data is our priority
          </p>
          <div className="mt-4 inline-block bg-[var(--muted)] px-4 py-2 rounded-full">
            <p className="text-sm text-[var(--muted-foreground)]">
              Last updated: September 19, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="mb-4">
            This Privacy Policy describes how TechLight collects, uses, and
            protects your personal information when you use our website.
          </p>
          <div className="p-4 border-l-4 border-[var(--custom-blue)] bg-[var(--muted)] rounded-r-lg">
            <p className="font-medium text-[var(--custom-blue)]">
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
                <KeyRound className="w-5 h-5 text-[var(--custom-blue)]" />
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
                <Database className="w-5 h-5 text-[var(--custom-blue)]" />
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


      </div>
    </div>
  );
};

export default PrivacyPolicy;
