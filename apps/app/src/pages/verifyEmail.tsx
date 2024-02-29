import { emailCode } from "@/atom/emailCode";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React, { use, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRecoilValue } from "recoil";

const verifyEmail = () => {
  const [newOtp, setNewOtp] = useState("");
  const code = useRecoilValue(emailCode);
  const router = useRouter();
  //   const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (e: any) => {
    const value = e.target.value;
    setNewOtp(value);
    console.log(router.query.e);
    // setNewOtp((prev) => prev + value);

    // if (value.length === 1 && index < 5) {
    //   //@ts-ignore
    //   refs[index + 1].current.focus();
    // }
  };

  const verify = trpc.email.verifyEmail.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast("Email Verified");
      router.push("/login");
    },
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const correct = newOtp == code.toString();
    let email;
    if (typeof router.query.e === "string") {
      email = router.query.e;
    }

    if (email) {
      verify.mutate({ email, correct });
    }
  };

  return (
    <div className="text-center">
      <div className="text-7xl text-center my-32">Enter Code Here</div>
      <form
        className="flex flex-col gap-8 mx-auto items-center"
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="w-64 h-24 rounded-sm text-black text-6xl text-center"
          maxLength={6}
          onChange={(e) => handleChange(e)}
        />

        <button type="submit" className="w-64 bg-blue-500 p-2 rounded-lg">
          Verify
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default verifyEmail;
