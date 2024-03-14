import { currentChannel } from "@/atom/currentChannel";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";

const ChannelSidebar = () => {
  const router = useRouter();
  const serverId = parseInt(router.query.sid as string);
  const [textChannels, setTextChannels] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [name, setName] = useState<string>();

  const [currChannel, setCurrChannel] = useRecoilState(currentChannel);
  console.log(currChannel);

  const [dialog, setDialog] = useState(false);

  const get = trpc.channel.get.useMutation({
    onSuccess: (data) => {
      if (data.code === 501) {
        toast(data.message);
      }
      //@ts-ignore
      if (data.code === 201) {
        console.log("got the data");
        //@ts-ignore
        setTextChannels(data.data);
      }
    },
  });

  const create = trpc.channel.create.useMutation({
    onSuccess: (data) => {
      if (data.code === 501) {
        toast(data.message);
      }

      if (data.code === 201) {
        toast(data.message);
      }
    },
  });

  useEffect(() => {
    get.mutate({
      //@ts-ignore
      token: localStorage.getItem("token"),
      serverId: serverId,
    });
  }, [serverId]);

  const handleSubmit = async () => {
    create.mutate({
      //@ts-ignore
      serverId: serverId,
      token: localStorage.getItem("token") as string,
      cname: name as string,
      type: "text",
    });
  };

  return (
    <div
      className="bg-gray-700  w-56 flex flex-col gap-12 p-3 items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h1 className="font-bold text-xl my-10">
          Text channels{" "}
          <button onClick={() => setDialog((prev) => !prev)}>+</button>
        </h1>

        <div className="flex flex-col gap-2">
          {textChannels.map((channel) => {
            return (
              <div
                onClick={() => {
                  setCurrChannel(channel.id);
                }}
                className={`${currChannel === channel.id ? "bg-white text-gray-800 border border-blue-400" : "bg-blue-400"} p-2 w-44 my-1 rounded-lg hover:bg-blue-300 hover:cursor-pointer font-semibold`}
              >
                {channel.name}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h1 className="font-bold text-xl my-10">
          Voice channels{" "}
          <button onClick={() => setDialog((prev) => !prev)}>+</button>
        </h1>

        <div className="flex flex-col gap-2">
          {voiceChannels.map((channel) => {
            return (
              <div className="p-2 w-44 bg-blue-400 my-1 rounded-lg">
                {channel.name}
              </div>
            );
          })}
        </div>

        {dialog && (
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-black h-full w-full rounded-xl mx-15 p-4 flex flex-col gap-3 items-center fixed justify-center top-0 left-0 bg-opacity-60 "
            >
              <div className="text-2xl font-bold">Create New Channel</div>
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
                placeholder="Enter Channel Name"
                className="p-3 w-1/3 rounded-lg text-black"
              />
              <div className="flex gap-5 items-center w-full justify-center">
                <button className="my-5 w-1/6 bg-blue-500 p-2 rounded-lg">
                  Create
                </button>
                <button
                  onClick={() => setDialog((prev) => !prev)}
                  className="my-5 w-1/6 bg-red-500 p-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChannelSidebar;
