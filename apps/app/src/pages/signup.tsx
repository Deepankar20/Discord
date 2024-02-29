import { emailCode } from "@/atom/emailCode";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  console.log(formData);

  const router = useRouter();

  const [code, setCode] = useRecoilState(emailCode);

  const sendEmail = trpc.email.sendEmail.useMutation({
    onSuccess: (data) => {
      if (data.code) {
        //@ts-ignore
        setCode(data.code);
      }
    },
  });

  const signup = trpc.user.signup.useMutation({
    onSuccess: async (data) => {
      if (data.code === 401) {
        toast(data.message);
      }
      if (data.code === 501) {
        toast(data.message);
      }

      if (data.code === 201) {
        await sendEmail.mutate({ email: formData.email });
        router.push(`/verifyEmail?e=${formData.email}`);
      }
    },
  });

  const [isError, setIsError] = useState(false);

  const handleFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    signup.mutate(formData);
  };

  return (
    <div className="mx-auto text-center flex flex-col w-1/2">
      <h1 className="text-7xl text-center my-48">Sign Up</h1>
      <form
        onSubmit={handleFormSubmit}
        className=" flex flex-col gap-10 justify-center items-center"
      >
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="p-4 w-2/3 rounded-lg text-slate-800"
          onChange={handleFormChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-4 w-2/3 rounded-lg text-slate-800"
          onChange={handleFormChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-4 w-2/3 rounded-lg text-slate-800"
          onChange={handleFormChange}
        />
        <button
          type="submit"
          className="bg-slate-600 p-3 my-5 rounded-lg w-2/3 hover:bg-slate-500 text-lg font-semibold"
        >
          Signup
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Signup;
