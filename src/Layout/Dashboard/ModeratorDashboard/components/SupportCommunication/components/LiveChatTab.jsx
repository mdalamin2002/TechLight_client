import React, { useState } from "react";

const fakeChats = [
  {
    id: "CHAT-1001",
    user: "Alice",
    messages: [
      { sender: "user", message: "Hi, I need help with my order." },
      { sender: "moderator", message: "Sure, what seems to be the issue?" },
    ],
  },
  {
    id: "CHAT-1002",
    user: "Bob",
    messages: [
      { sender: "user", message: "Payment failed during checkout." },
      { sender: "moderator", message: "Please check your card details." },
    ],
  },
  {
    id: "CHAT-1003",
    user: "Charlie",
    messages: [
      { sender: "user", message: "Can I get a refund?" },
    ],
  },
];

const LiveChatTab = () => {
  const [chats, setChats] = useState(fakeChats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!selectedChat || !message) return;

    setChats(
      chats.map((c) =>
        c.id === selectedChat.id
          ? { ...c, messages: [...c.messages, { sender: "moderator", message }] }
          : c
      )
    );
    setMessage("");
  };

  return (
    <div className="flex gap-4">
      {/* Chat List */}
      <div className="w-1/3 border p-2 h-96 overflow-y-auto rounded-lg">
        <h3 className="font-semibold mb-2">Chats</h3>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-2 mb-1 cursor-pointer rounded ${
              selectedChat?.id === chat.id ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            {chat.user}
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="w-2/3 border p-2 h-96 flex flex-col justify-between rounded-lg">
        <div className="overflow-y-auto mb-2 h-80">
          {selectedChat ? (
            selectedChat.messages.map((msg, i) => (
              <div
                key={i}
                className={`p-1 my-1 rounded max-w-xs ${
                  msg.sender === "moderator"
                    ? "bg-blue-200 self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                {msg.message}
              </div>
            ))
          ) : (
            <p className="text-gray-400">Select a chat to view messages</p>
          )}
        </div>

        {selectedChat && (
          <div className="flex gap-2">
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatTab;
