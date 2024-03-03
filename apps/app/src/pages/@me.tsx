import React, { useState } from "react";
import ServerSidebar from "../components/ServerSidebar";
import ChannelSidebar from "../components/ChannelSidebar";
import Navbar from "../components/Navbar";
import ChatSection from "../components/ChatSection";
import { useRecoilState, useRecoilValue } from "recoil";
import { dialogBox } from "@/atom/dialogboxstate";
import { dialogObject } from "@/atom/dialogObject";
import { trpc } from "@/utils/trpc";
import { toast, ToastContainer } from "react-toastify";
import DmSidebar from "@/components/dmSidebar";

const home = () => {
  const dialog = useRecoilValue(dialogBox);
  const [dialog1, setDialog1] = useRecoilState(dialogBox);
  const [name, setName] = useState("");

  const create = trpc.server.create.useMutation({
    onSuccess: (data) => {
      if (data.code === 403) {
        toast(data.message);
      }
      if (data.code === 201) {
        toast(data.message);
      }
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let token;
    if (typeof localStorage !== undefined) {
      token = localStorage?.getItem("token");
    }

    //@ts-ignore
    await create.mutate({ name, token });
    setDialog1(false);
  };

  return (
    <div>
      <div className="flex">
        <ServerSidebar />
        <DmSidebar />

        <div className="flex flex-col">
          <Navbar />
          <ChatSection />
          {dialog && (
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-slate-500 h-max w-72 rounded-xl mx-15 p-4 flex flex-col gap-3 items-center my-5"
              >
                <div className="text-xl">Create Your Server</div>
                {/* <input
                type="file"
                accept="image/*"
                className="rounded-lg text-center"
              /> */}
                <input
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  placeholder="Enter Server Name"
                  className="p-3 rounded-lg text-black"
                />
                <button className="my-5 bg-blue-500 p-2 rounded-lg">
                  Create
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default home;
