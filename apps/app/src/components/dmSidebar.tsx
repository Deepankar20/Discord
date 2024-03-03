import { currentChat } from "@/atom/currentChat";
import { dm } from "@/atom/dm";
import { useQueries } from "@tanstack/react-query";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const DmSidebar = () => {
  const friends = useRecoilValue(dm);
  const router = useRouter();
  const serverId = router.query.sId;
  const [currChat, setCurrChat] = useRecoilState(currentChat);

  const handleClick = (user: any) => {
    setCurrChat(user.email);
  };
  // console.log(serverId);

  return (
    <div
      className="bg-slate-700 w-64 flex flex-col gap-12 p-3 items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h1 className="text-xl my-5">Friends</h1>
      </div>

      {friends.map((user) => {
        //@ts-ignore
        return (
          <div
            onClick={() => handleClick(user)}
            className="bg-slate-500 w-60 h-12 -my-3 p-3 hover:bg-slate-400 hover:cursor-pointer items-center justify-center rounded-md border-b-2 border-slate-900"
            //@ts-ignore
            key={user.id}
          >
            {
              //@ts-ignore
              user.username
            }
          </div>
        );
      })}
      <div></div>
    </div>
  );
};

export default DmSidebar;
