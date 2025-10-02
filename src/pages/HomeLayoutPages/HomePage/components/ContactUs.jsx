import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Modern Gradient Contact Info Card with motion
const ContactInfoCard = ({
  icon: Icon,
  title,
  info,
  subInfo,
  gradient,
  index,
}) => {
  return (
    <motion.div
      className="group relative overflow-hidden bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}
      />

      <div className="relative flex items-start gap-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h5 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
            {title}
          </h5>
          <p className="text-muted-foreground font-medium">{info}</p>
          {subInfo && (
            <p className="text-sm text-muted-foreground/70 mt-1">{subInfo}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Contact Us Section
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9+\-() ]{10,}$/.test(formData.phone))
      newErrors.phone = "Phone number is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <section className="relative section py-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Get In Touch
            </span>
          </div>
          <h2>Let's Start a Conversation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Questions about our cutting-edge gadgets? Our tech-savvy team is
            ready to help you find the perfect solution.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 mx-auto">
          {/* Contact Cards */}
          <div className="lg:col-span-2 space-y-6 md:mt-3">
            <ContactInfoCard
              index={0}
              icon={Phone}
              title="Call Us"
              info="+1 (555) 123-4567"
              subInfo="Mon-Fri, 9AM - 6PM EST"
              gradient="from-blue-500 to-cyan-500"
            />
            <ContactInfoCard
              index={1}
              icon={Mail}
              title="Email Us"
              info="support@techgadgets.com"
              subInfo="Response within 24 hours"
              gradient="from-purple-500 to-pink-500"
            />
            <ContactInfoCard
              index={2}
              icon={MapPin}
              title="Visit Our Store"
              info="123 Tech Street, Silicon Valley"
              subInfo="CA 94025, United States"
              gradient="from-orange-500 to-red-500"
            />
            <ContactInfoCard
              index={3}
              icon={Clock}
              title="Business Hours"
              info="Mon-Fri: 9AM - 6PM"
              subInfo="Saturday: 10AM - 4PM"
              gradient="from-green-500 to-emerald-500"
            />
          </div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border shadow-sm p-6 lg:p-7">
              {/* Floating gradient orb */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold">
                      Send us a Message
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We'll get back to you quickly
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-foreground mb-2.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                            errors.name
                              ? "border-red-500"
                              : focusedField === "name"
                              ? "border-primary"
                              : "border-border"
                          } bg-background/50 text-foreground focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/50`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-foreground mb-2.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                            errors.email
                              ? "border-red-500"
                              : focusedField === "email"
                              ? "border-primary"
                              : "border-border"
                          } bg-background/50 text-foreground focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/50`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-foreground mb-2.5"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                            errors.phone
                              ? "border-red-500"
                              : focusedField === "phone"
                              ? "border-primary"
                              : "border-border"
                          } bg-background/50 text-foreground focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/50`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-foreground mb-2.5"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                            errors.subject
                              ? "border-red-500"
                              : focusedField === "subject"
                              ? "border-primary"
                              : "border-border"
                          } bg-background/50 text-foreground focus:outline-none transition-all duration-300 appearance-none cursor-pointer`}
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">
                            Product Inquiry
                          </option>
                          <option value="technical-support">
                            {" "}
                            Technical Support
                          </option>
                          <option value="order-status">Order Status</option>
                          <option value="warranty">Warranty Claim</option>
                          <option value="return">Return/Exchange</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-foreground mb-2.5"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField("")}
                        rows="5"
                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                          errors.message
                            ? "border-red-500"
                            : focusedField === "message"
                            ? "border-primary"
                            : "border-border"
                        } bg-background/50 text-foreground focus:outline-none transition-all duration-300 resize-none placeholder:text-muted-foreground/50`}
                        placeholder="Tell us how we can help you with our tech products..."
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Modern Submit Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="group relative w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-primary/50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          <span>Send Message</span>
                          <Zap className="w-4 h-4 opacity-70" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Success Dialog remains unchanged */}
        <AlertDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        >
          <AlertDialogContent className="max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur-xl">
            <AlertDialogHeader>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-11 h-11 text-white" />
                  </div>
                </div>
              </div>
              <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Message Sent Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base text-muted-foreground leading-relaxed">
                Thank you for reaching out! Our tech support team has received
                your message and will respond within 24 hours.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center sm:justify-center">
              <AlertDialogAction className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-700 px-8 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Awesome!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
};

export default ContactUs;
