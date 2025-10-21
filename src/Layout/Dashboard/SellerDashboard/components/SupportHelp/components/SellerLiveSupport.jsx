import React, { useState, useEffect, useRef } from "react";
import { Send, Search, MoreVertical } from "lucide-react";

const SellerLiveSupport = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  // Hardcoded admin/moderator/support profiles
  const [chats] = useState([
    { id: 1, name: "Light Dev Team", role: "admin", lastMsg: "Sure, I’ll fix that soon.", time: "Yesterday" },
    { id: 2, name: "Nahin", role: "moderator", lastMsg: "Endgame Final Project done.", time: "Yesterday" },
    { id: 3, name: "Juni", role: "support", lastMsg: "#include <stdio.h>", time: "Yesterday" },
    { id: 4, name: "Rahmat", role: "moderator", lastMsg: "Database connected successfully!", time: "Yesterday" },
  ]);

  // Messages keyed by chat id
  const [messages, setMessages] = useState({
    1: [{ from: "them", role: "admin", text: "Hello! Need any help?", time: "10:00 AM" }],
    2: [{ from: "them", role: "moderator", text: "Project is almost ready!", time: "11:00 AM" }],
    3: [{ from: "them", role: "support", text: "C code sent already.", time: "12:00 PM" }],
    4: [{ from: "them", role: "moderator", text: "Database connected successfully!", time: "1:00 PM" }],
  });

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMessages = { ...messages };
    if (!newMessages[selectedChat.id]) newMessages[selectedChat.id] = [];
    newMessages[selectedChat.id].push({ from: "me", text: message, time: timeString });
    setMessages(newMessages);
    setMessage("");
  };

  return (
    <div className="flex h-[90vh] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Chats</h2>
          <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="bg-transparent text-sm outline-none flex-1 px-2"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                selectedChat?.id === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">
                {chat.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">
                  {chat.name}{" "}
                  <span
                    className={`text-xs font-medium ml-1 px-1 rounded ${
                      chat.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : chat.role === "moderator"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {chat.role.toUpperCase()}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 truncate">{chat.lastMsg}</p>
              </div>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">
                  {selectedChat.name[0]}
                </div>
                <div>
                  <h2 className="font-semibold text-sm">{selectedChat.name}</h2>
                  <p className="text-xs text-gray-500">{selectedChat.role.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages[selectedChat.id]?.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm break-words max-w-xs ${
                      msg.from === "me"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : `bg-white border rounded-bl-none ${
                            msg.role === "admin"
                              ? "border-red-200"
                              : msg.role === "moderator"
                              ? "border-yellow-200"
                              : "border-green-200"
                          }`
                    }`}
                  >
                    {msg.from !== "me" && (
                      <span className="text-[10px] font-medium text-gray-500 mb-1 block">
                        {msg.role.toUpperCase()}
                      </span>
                    )}
                    {msg.text}
                    <div className="text-[10px] text-gray-400 mt-1 text-right">{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
              alt="Chat Illustration"
              className="w-20 mb-3 opacity-70"
            />
            <h2 className="text-lg font-semibold">Seller Live Chat</h2>
            <p className="text-sm">Select a chat to start conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerLiveSupport;
