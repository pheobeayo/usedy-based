import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); 
    }
  };

  return (
    <div className="p-4 flex items-center space-x-2">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSend}
        className="bg-[#154A80] text-white px-4 py-2 rounded hover:bg-[#DBECDB] "
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
