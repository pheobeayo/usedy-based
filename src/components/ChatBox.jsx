import React from "react";

const ChatBox = ({ messages }) => {
  return (
    <div className="p-4 overflow-y-auto h-64 border-b border-[#015C28]">
        
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 ${
            msg.from === "You" ? "text-right" : "text-left"
          }`}
        >
          <p className="text-sm text-gray-500">
            {msg.from === "You" ? "You" : msg.from}
          </p>
          <p
            className={`inline-block px-4 py-2 rounded-lg ${
              msg.from === "You"
                ? "bg-[#154A80] text-white"
                : "bg-[#EDF5FE] text-[#154A80]"
            }`}
          >
            {msg.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
