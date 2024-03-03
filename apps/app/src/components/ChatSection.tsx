import React, { useState } from "react";

const ChatSection = () => {
  const [messages, setMessages] = useState([{}]);

  // setMessages([{from:"deep1", to:"deep2", content:"hello"}])
  return (
    <div className="mt-[86vh] p-3">
      <input type="text" className="text-black rounded-sm w-[72vw] h-10" />
      <button className="bg-blue-500  h-10 w-20  rounded-sm">send</button>
    </div>
  );
};

export default ChatSection;
