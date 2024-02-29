import React from "react";
import ServerSidebar from "../../components/ServerSidebar";
import ChannelSidebar from "../../components/ChannelSidebar";
import Navbar from "../../components/Navbar";
import ChatSection from "../../components/ChatSection";

const home = () => {
  return (
    <div>
      <div className="flex gap-6">
        <ServerSidebar />
        <ChannelSidebar />
        <div className="flex flex-col">
            <Navbar/>
            <ChatSection/>
        </div>
      </div>
    </div>
  );
};

export default home;
