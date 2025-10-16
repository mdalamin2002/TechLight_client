import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from "@/Components/ui/dialog";
import { MessageCircle, } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import useAxiosSecure from "@/utils/useAxiosSecure";
import SupportChartModalForm from "./SupportChartModalForm";

const SupportChatModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user,userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing & Payment" },
    { value: "order", label: "Order Support" },
    { value: "account", label: "Account Issues" },
    { value: "product", label: "Product Inquiry" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please describe your issue";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      // Create a new conversation
      const response = await axiosSecure.post("/support/conversations", {
        userId: userData?._id || "guest",
        userName: formData.name,
        senderRole: userData?.role||"user",
        userEmail: formData.email,
        userPhone: formData.phone,
        subject: formData.subject,
        category: formData.category,
        initialMessage: formData.description,
      });

      if (response.data.success) {
        toast.success("Support request created successfully!");
        
        // Navigate to chat page with conversation ID
        navigate(`/support-chat/${response.data.conversation._id}`, {
          state: { conversation: response.data.conversation },
        });

        // Close modal and reset form
        onClose();
        setFormData({
          name: user?.displayName || "",
          email: user?.email || "",
          phone: "",
          subject: "",
          category: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error creating support request:", error);
      toast.error(error.response?.data?.message || "Failed to create support request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-primary">
                Customer Support
              </DialogTitle>
              <DialogDescription className="text-slate-600 mt-1">
                We're here to help! Describe your issue and we'll get back to you shortly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <SupportChartModalForm handleSubmit={handleSubmit} formData={formData} handleInputChange={handleInputChange} errors={errors} loading={loading} categories={categories} onClose={onClose}>
        </SupportChartModalForm>
      </DialogContent>
    </Dialog>
  );
};

export default SupportChatModal;
