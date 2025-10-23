import React, { useState, useEffect } from "react";
import axios from "axios";
import FloatingChatButton from "./FloatingChatButton";
import ChatSidebar from "./ChatSidebar";

export default function TechLightChatbot() {
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

  // Apply margin to body when sidebar is open (but not in fullscreen)
  useEffect(() => {
    if (isOpen && !isFullscreen) {
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
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
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
      />
    </>
  );
}
