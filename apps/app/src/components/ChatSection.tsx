import { currentChat } from "@/atom/currentChat";
import { useSocket } from "@/context/SocketProvider";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chat } from "@/atom/chat";

import jwt from "jsonwebtoken";

const ChatSection = () => {
  const currChat = useRecoilValue(currentChat);
  const [_chat, setChat] = useRecoilState(chat);
  const [fromEmail, setFromEmail] = useState<string>();
  const [value, setValue] = useState<string>();

  interface Imsg {
    from: string;
    to: string;
    content: string;
  }

  const { messages } = useSocket();

  const [message, setMessage] = useState({
    from: "",
    to: "",
    content: "",
  });
  const { sendMessage } = useSocket();

  const handleChange = (e: any) => {
    const content = e.target.value;
    setValue(content);
    setMessage({ from: "", to: currChat, content });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setValue("");
    //@ts-ignore
    setChat((prev) => [...prev, message]);
    sendMessage(message);
  };

  useEffect(() => {
    //@ts-ignore
    setChat([..._chat, ...messages]);
  }, []);

  // setMessages([{from:"deep1", to:"deep2", content:"hello"}])
  return (
    <div>
      <div
        className="flex flex-col gap-2 max-h-screen
       overflow-y-auto"
      >
        {_chat.map((msg: Imsg) => {
          return (
            <div
              className={`text-white bg-blue-700 w-fit p-4 pb-0 pt-0 rounded-lg`}
            >
              {msg.content}
            </div>
          );
        })}
      </div>
      <form className="fixed bottom-0 p-3" onSubmit={handleSubmit}>
        <input
          type="text"
          className="text-black rounded-sm w-[72vw] h-10"
          onChange={handleChange}
          value={value}
        />
        <button className="bg-blue-500  h-10 w-20  rounded-sm">send</button>
      </form>
    </div>
  );
};

export default ChatSection;
