import { useSocket } from "@/context/SocketProvider";
import React, { useState } from "react";

const ChatSection = () => {
  const [message, setMessage] = useState({
    from: "",
    to: "",
    content: "",
  });
  const { sendMessage } = useSocket();

  const handleChange = (e: any) => {
    const content = e.target.value;
    setMessage({ ...message, content });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    sendMessage(message);
  };

  // setMessages([{from:"deep1", to:"deep2", content:"hello"}])
  return (
    <form className="mt-[86vh] p-3" onSubmit={handleSubmit}>
      <input
        type="text"
        className="text-black rounded-sm w-[72vw] h-10"
        onChange={handleChange}
      />
      <button className="bg-blue-500  h-10 w-20  rounded-sm">send</button>
    </form>
  );
};

export default ChatSection;
