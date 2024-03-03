import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { dm } from "@/atom/dm";

const Navbar = () => {
  const [users, setUsers] = useState([]);
  const [createdm, setCreatedm] = useRecoilState(dm);
  // console.log(createdm);

  // const getAllUsers = trpc.user.getAllUsers.useMutation({
  //   onSuccess: (data) => {},
  // });

  const searchUsers = trpc.user.searchUsers.useMutation({
    onSuccess: (data) => {
      //@ts-ignore

      if (data.code === 201) {
        //@ts-ignore
        setUsers(data?.data);
      }
    },
  });

  const createDM = (user) => {
    setUsers([]);
    //@ts-ignore
    setCreatedm((prev) => [...prev, user]);
  };

  const handleChange = async (e: any) => {
    const searchParams = e.target.value;

    const token = localStorage.getItem("token");
    //@ts-ignore
    await searchUsers.mutate({ token, searchParams });
  };

  return (
    <div className="bg-slate-600 h-14 flex-col p-2" style={{ width: "96rem" }}>
      <div className="flex">
        <input
          type="text"
          placeholder="search users"
          className="p-1 rounded-md text-black"
          onChange={handleChange}
        />
        <button
          // onClick={}
          className="mx-5 bg-black p-2 rounded-lg items-center "
        >
          Search Users
        </button>
      </div>
      <div>
        {users.map((user) => {
          return (
            <div
              //@ts-ignore

              key={user.id}
              className="bg-slate-700 w-48 p-2 border border-white hover:bg-slate-600 hover:cursor-pointer"
              onClick={() => createDM(user)}
            >
              {
                //@ts-ignore

                user.username
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
