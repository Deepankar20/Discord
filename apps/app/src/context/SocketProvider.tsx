"use client";
import React, { useCallback, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is ubdefined");

  return state;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
    console.log("Send Message", msg);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const _socket = io("http://localhost:8000", {
      query: {
        //@ts-ignore
        userToken: jwt.decode(token)?.email,
      },
    });

    return () => {
      _socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
