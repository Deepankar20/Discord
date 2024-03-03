import React, { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { dialogBox } from "@/atom/dialogboxstate";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { Router } from "next/router";
import { useRouter } from "next/router";
import { string } from "zod";
import { redirect } from "next/navigation";

const ServerSidebar = () => {
  const [dialog, setDialog] = useRecoilState(dialogBox);
  const [servers, setServers] = useState([]);
  const router = useRouter();
  const serverId = router.query.sId;
  console.log(servers);

  const create = trpc.server.create.useMutation({
    onSuccess: (data) => {
      console.log("everything done", localStorage.getItem("token"));
    },
  });

  const getServers = trpc.server.getServers.useMutation({
    onSuccess: (data) => {
      if (data.code === 501) {
        toast(data.message);
      }
      if (data.code === 201) {
        //@ts-ignore
        setServers(data.data);
      }
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    getServers.mutate({ token: token as string });
  }, []);

  const handleButton = async () => {
    setDialog((prev) => !prev);
  };

  return (
    <div className="bg-gray-800 h-screen w-24">
      <h1
        onClick={() => router.push("/@me")}
        className="p-2 text-xl h-12 w-12 font-semibold bg-blue-500 rounded-full items-center mx-auto my-10 hover:cursor-pointer"
      >
        DM
      </h1>
      <div className="bg-gray-800 h-screen w-24 flex flex-col gap-12 p-3 items-center">
        <div className="flex flex-col gap-3 items-center">
          {servers.map((server) => {
            //@ts-ignore
            const isCurrentServer = server.id === router.query.sid;

            return (
              <div
                //@ts-ignore
                key={server.id}
                className={`p-2 text-2xl h-12 w-12 font-bold ${
                  isCurrentServer ? "bg-yellow-500" : "bg-gray-500"
                } rounded-full text-center hover:cursor-pointer hover:rounded-xl hover:bg-blue-500`}
                onClick={() => {
                  //@ts-ignore
                  router.push(`/home?sid=${server.id}`);
                }}
              >
                {
                  //@ts-ignore
                  server.name[0]
                }
              </div>
            );
          })}
        </div>
        <button
          className="p-2 text-2xl h-12 w-12 font-bold bg-blue-500 rounded-full"
          onClick={handleButton}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ServerSidebar;
