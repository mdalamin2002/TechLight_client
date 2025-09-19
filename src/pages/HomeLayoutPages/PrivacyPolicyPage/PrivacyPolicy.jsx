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


    </div>
  );
};

export default PrivacyPolicy;
