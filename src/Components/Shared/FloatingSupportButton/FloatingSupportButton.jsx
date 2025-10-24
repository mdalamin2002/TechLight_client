import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-hot-toast";

const FloatingSupportButton = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(true);
      setTimeout(() => setShowText(false), 3000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Hide button for admin and moderator users
  if (userData?.role === "admin" || userData?.role === "moderator") {
    return null;
  }

  const handleSupportClick = async () => {
    // If not logged in, redirect to login
    if (!user) {
      toast.error("Please login to access support");
      navigate("/auth/login");
      return;
    }

    setIsLoading(true);

    try {
      // Get or create active conversation
      const response = await axiosSecure.post(
        `/support/conversations/active/${userData?._id}`,
        {
          userName: user?.displayName || "Guest",
          userEmail: user?.email || "",
          userPhone: userData?.phone || "",
        }
      );

      if (response.data.success) {
        const conversationId = response.data.conversation._id;

        // Navigate to chat page
        navigate(`/support-chat/${conversationId}`, {
          state: { conversation: response.data.conversation },
        });
      }
    } catch (error) {
      console.error("Error accessing support:", error);
      toast.error(error.response?.data?.message || "Failed to access support");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="fixed bottom-3 right-6 z-[9999] flex items-center gap-3"
    >
      {/* "Need help?" text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200"
          >
            <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Need help?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Pulse effect - behind button */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-ping opacity-20 pointer-events-none" />

        <Button
          onClick={handleSupportClick}
          disabled={isLoading}
          className="relative h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50"
        >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
};

export default FloatingSupportButton;
