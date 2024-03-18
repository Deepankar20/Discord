import { currentChat } from "@/atom/currentChat";
import { useSocket } from "@/context/SocketProvider";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chat } from "@/atom/chat";

import jwt from "jsonwebtoken";
import { currentChannel } from "@/atom/currentChannel";
import { useRouter } from "next/router";

const GroupChatSection = () => {
  const router = useRouter();
  const currChat = useRecoilValue(currentChat);
  const currChannel = useRecoilValue(currentChannel);

  const ref = useRef(null);

  const [fromEmail, setFromEmail] = useState<string>();
  const [value, setValue] = useState<string>();

  interface Imsg {
    from: string;
    channelId: number;
    content: string;
    server: string;
  }

  const { messages } = useSocket();

  const [message, setMessage] = useState({
    from: "",
    channelId: 0,
    content: "",
    server: "",
  });

  const { sendMessage, sendMessageChannel } = useSocket();

  const handleChange = (e: any) => {
    const content = e.target.value;
    setValue(content);

    //@ts-ignore
    const from = jwt.decode(localStorage.getItem("token") as string)?.email;
    console.log(message);

    setFromEmail(from);
    setMessage({
      from,
      channelId: currChannel,
      content,
      server: router.query.sid as string,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //@ts-ignore
    ref.current.scrollTop = 100;
    setValue("");
    //@ts-ignore
    sendMessageChannel(message);
  };

  // setMessages([{from:"deep1", to:"deep2", content:"hello"}])
  return (
    <div>
      <div
        ref={ref}
        className="flex flex-col gap-2 max-h-screen
       overflow-y-auto p-2 h-5/6"
      >
        {messages.map((msg: Imsg) => {
          return (
            <div className="flex gap-2 items-end">
              <div className="bg-gray-500 rounded-full h-6 w-6 text-center">
                {msg.from[0]}
              </div>
              <div
                className={`${msg.from === fromEmail ? "text-white bg-blue-700" : "text-black bg-white"}  w-fit p-5 pb-1 pt-1 rounded-l-none rounded-tl-lg rounded-lg rounded-br-lg rounded-r-none`}
              >
                {msg.content}
              </div>
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

export default GroupChatSection;
