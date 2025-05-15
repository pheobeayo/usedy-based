import { useState } from "react";
import chat from "../../assets/chat.svg";
import ChatBox from "../../components/ChatBox";
import MessageInput from "../../components/MessageInput";





const Chat = () => {
  const [messages, setMessages] = useState([
    { from: "0x123", message: "Hello I’m Naomi and I want inquire about your products. How do i get them when I pay?" },
    { from: "0x456", message: "Yea, thank you for showing interest in my products. How would you love to receive your products" },
  ]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { from: "You", message }]);
  };
  return (
    <main className="bg-white">
      <div className='grid max-sm:grid-cols-1 gap-2 gap-y-4 sm:grid-cols-1 md:grid-cols-2 '>
        <div className="bg-[#EDF5FE] h-[100vh]">
          <h1 className="text-[#154A80] mt-10 px-10 font-bold font-serif">Your Messages</h1>
        </div>
        <div className="bg-white h-[100vh]">
          <div className="p-4  flex flex-col items-center">
            <img src={chat} alt='chat' className="mx-4" />
            <h1 className="text-[#0F160F] mx-6 font-bold font-serif">Your Chat</h1>
            <p className="text-[#0F160F] font-serif font-medium">If you wish to purchase anything,
              you can start by messaging the seller.</p>
            <ChatBox messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>

      </div>

    </main>
  );
};

export default Chat;