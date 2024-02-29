import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ToastContainer, toast } from "react-toastify";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isError, setIsError] = useState(false);

  const login = trpc.user.login.useMutation({
    onSuccess:(data)=>{
      if(data.code === 404){
        toast("User not found : create an account");
      }

      if(data.code === 402){
        toast(data.message);
      }

      if(data.code === 501){
        toast(data.message)
      }

      if(data.code === 201){
        toast(data.message)
        //@ts-ignore
        localStorage.setItem("token", data.token);
      }
    }
  })

  const handleFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleFormSubmit = async (e:any) => {
    e.preventDefault();

    await login.mutate(formData);

  };
  return (
    <div className="mx-auto text-center flex flex-col w-1/2">
      <h1 className="text-7xl text-center my-52">Log In</h1>
      <form
        className=" flex flex-col gap-10 justify-center items-center"
        onSubmit={handleFormSubmit}
      >
        <input
          name="email"
          type="text"
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
          Login
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default Login;
