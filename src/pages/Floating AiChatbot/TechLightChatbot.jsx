import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FloatingChatButton from "./FloatingChatButton";
import ChatSidebar from "./ChatSidebar";
import useAuth from "@/hooks/useAuth";

export default function TechLightChatbot() {
  const { user, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hello! Welcome to TechLight. I'm your shopping assistant. How can I help you find the perfect gadget today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Apply margin to body when sidebar is open (but not in fullscreen and only on desktop)
  useEffect(() => {
    if (isOpen && !isFullscreen && typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.body.style.marginRight = `${sidebarWidth}px`;
      document.body.style.transition = "margin-right 0.3s ease";
    } else {
      document.body.style.marginRight = "0";
    }

    return () => {
      document.body.style.marginRight = "0";
      document.body.style.transition = "";
    };
  }, [isOpen, sidebarWidth, isFullscreen]);

  // Help text animation
  useEffect(() => {
    if (!isOpen) {
      const timer = setInterval(() => {
        setShowHelp((prev) => !prev);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Send message and connect to backend
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("https://techlight-server-1.onrender.com/api/ai/chat", {
        message: input,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: res.data.reply || "Sorry, I couldn't understand that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 2,
        type: "ai",
        text: "Oops! Something went wrong connecting to the AI service.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSupportClick = async () => {
    if (!user) {
      toast.error("Please login to access support");
      window.location.href = "/auth/login";
      return;
    }

    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      const API_URL = import.meta.env.VITE_prod_baseURL;

      // Create axios instance with Firebase ID token
      const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Get database user ID
      let dbUserId = userData?._id;

      // If userData not loaded yet, fetch it by email
      if (!dbUserId) {
        const roleRes = await axios.get(
          `${API_URL}/users/role/${encodeURIComponent(user.email)}`
        );
        dbUserId = roleRes.data?._id;
      }

      if (!dbUserId) {
        toast.error("Could not resolve user ID. Please try again.");
        return;
      }

      // Get or create active conversation
      const response = await axiosInstance.post(
        `/support/conversations/active/${dbUserId}`,
        {
          userName: user.displayName || "Guest",
          userEmail: user.email || "",
          userPhone: userData?.phone || "",
        }
      );

      if (response.data?.success) {
        const conversationId = response.data.conversation._id;
        window.location.href = `/support-chat/${conversationId}`;
      } else {
        throw new Error("Failed to access support");
      }
    } catch (error) {
      console.error("Error accessing support:", error);

      // If auth error, redirect to login
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth/login";
      } else {
        toast.error(error?.response?.data?.message || "Failed to access support");
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  return (
    <>
      <FloatingChatButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        showHelp={showHelp}
      />

      <ChatSidebar
        isOpen={isOpen}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        messages={messages}
        isTyping={isTyping}
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onClose={handleClose}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
        onSupportClick={handleSupportClick}
      />
    </>
  );
}
