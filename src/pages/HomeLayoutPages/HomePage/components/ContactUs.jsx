import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email format";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (showSuccess) {
      setShowSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.2) {
        setSubmitStatus("success");
        setShowSuccess(true);
        setFormData({
          category: "",
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.log(error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-background flex flex-col items-center px-4 py-10 mt-12">
      {/* Header */}
      <h1>Contact Us</h1>
      <p className="text-custom-subtext max-w-xl text-center mb-10">
        Have questions or need help? Reach out to us through the form below or
        use any of the contact methods provided.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Contact Form */}
        <div className="bg-custom-primary shadow-xl p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 border-b border-custom-subtext/30 pb-2 text-custom-text">
            Send Message
          </h2>

          <div className="space-y-4">
            {/* Support Category */}
            <div>
              <label className="block text-custom-text font-medium mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full custom-input bg-custom-primary text-custom-text border-custom-subtext rounded-lg"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="order-issues">Order Issues</option>
                <option value="returns-refunds">Returns & Refunds</option>
                <option value="payment-support">Payment Support</option>
                <option value="general-queries">General Queries</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-custom-text font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className={`w-full custom-input bg-custom-primary text-custom-text rounded-lg ${
                  errors.name ? "border-red-500" : "border-custom-subtext"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-custom-text font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className={`w-full custom-input bg-custom-primary text-custom-text rounded-lg ${
                  errors.email ? "border-red-500" : "border-custom-subtext"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-custom-text font-medium mb-2">
                Phone Number{" "}
                <span className="text-custom-subtext">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your Phone Number"
                className={`w-full custom-input bg-custom-primary text-custom-text rounded-lg ${
                  errors.phone ? "border-red-500" : "border-custom-subtext"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-custom-text font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full custom-input bg-custom-primary text-custom-text border-custom-subtext rounded-lg"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-custom-text font-medium mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full custom-input bg-custom-primary text-custom-text rounded-lg resize-none ${
                  errors.message ? "border-red-500" : "border-custom-subtext"
                }`}
                rows="4"
                placeholder="Write your message..."
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-3 bg-custom-accent text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-center justify-center gap-2 text-green-500 text-sm font-medium p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                Thank you, we'll get back to you soon.
              </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                Something went wrong. Please try again later.
              </div>
            )}
          </div>
        </div>

        {/* Direct Info / Map / Links */}
        <div className="flex flex-col justify-between gap-5">
          {/* Contact Info */}
          <div className="bg-custom-primary shadow-xl p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 border-b border-custom-subtext/30 pb-2 text-custom-text">
              Direct Contact
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-custom-accent/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-custom-accent" />
                </div>
                <div>
                  <span className="font-semibold text-custom-text">Email:</span>{" "}
                  <span className="text-custom-subtext">
                    support@gazetmart.com
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-custom-accent/10 rounded-lg flex items-center justify-center mt-1">
                  <Phone className="w-4 h-4 text-custom-accent" />
                </div>
                <div>
                  <span className="font-semibold text-custom-text">Phone:</span>
                  <div className="text-custom-subtext">
                    <div>+880 1234 567890</div>
                    <div>+880 1987 654321</div>
                    <div>+880 1555 123456</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-custom-accent/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-custom-accent" />
                </div>
                <div>
                  <span className="font-semibold text-custom-text">
                    Address:
                  </span>{" "}
                  <span className="text-custom-subtext">
                    123 Main Street, Dhaka
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-custom-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-custom-accent" />
                </div>
                <div>
                  <span className="font-semibold text-custom-text">
                    Business Hours:
                  </span>{" "}
                  <span className="text-custom-subtext">
                    Mon–Fri, 9 AM – 6 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-custom-primary overflow-hidden rounded-xl shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8458121738366!2d90.39156347415207!3d23.750876378692525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8942a2b6e17%3A0x5f2d8c74c329fac5!2sDhaka!5e0!3m2!1sen!2sbd!4v1694882956781!5m2!1sen!2sbd"
              width="100%"
              height="340"
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Shortcut & Privacy */}
      <div className="max-w-6xl mt-10 text-center">
        <p className="text-custom-text">
          Have more questions? Check our{" "}
          <a href="/faq" className="text-custom-accent hover:opacity-80">
            FAQ page
          </a>
        </p>
        <p className="text-sm text-custom-subtext mt-2">
          We respect your privacy. Your details are safe with us.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <a
            href="mailto:support@gazetmart.com"
            className="px-6 py-2 rounded-lg font-semibold text-custom-accent border-2 border-custom-accent hover:text-white hover:bg-custom-accent transition shadow-md"
          >
            Email Us
          </a>
          <a
            href="tel:+8801234567890"
            className="px-6 py-2 rounded-lg font-semibold text-custom-accent border-2 border-custom-accent hover:text-white hover:bg-custom-accent transition shadow-md"
          >
            Call Us
          </a>
          <a
            href="#"
            className="px-6 py-2 rounded-lg font-semibold text-custom-accent border-2 border-custom-accent hover:text-white hover:bg-custom-accent transition shadow-md"
          >
            Chat Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
