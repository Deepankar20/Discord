"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import jwt from "jsonwebtoken";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface Imsg {
  from: string;
  to: string;
  content: string;
}

interface ISocketContext {
  sendMessage: (msg: Imsg) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is ubdefined");

  return state;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
    console.log("Send Message", msg);
    console.log(socket?.id);

    if (socket) {
      console.log("hi");

      socket.emit("event:message", msg);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const _socket = io("http://localhost:8000", {
      query: {
        //@ts-ignore
        userToken: jwt.decode(token)?.email,
      },
    });

    
    _socket.on("connect", () => {
      console.log("Socket connected, ID:", _socket.id);
    });
    console.log("socket object : ", _socket);

    setSocket((prev) => _socket);

    return () => {
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
