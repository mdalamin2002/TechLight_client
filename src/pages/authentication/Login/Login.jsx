import React, { useState } from "react";
import { useNavigate } from "react-router";
import LoginForm from "./LoginForm";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "@/hooks/useAuth";
import { SaveUserInDb } from "@/utils/ShareUtils";
import Swal from "sweetalert2";
import axios from "axios";
import { lockCheck, trackLogin } from "@/utils/userBlock";
import GithubLogin from "../SocialLogin/GithubLogin";

const Login = () => {
  const { loginWithEmailPass } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);

    //checking user account lock or not
    const checkUserAccount = await lockCheck(email);

    try {
      //login email and password
      const credential = await loginWithEmailPass(email, password);

      //Update User
      const updateUser = {
        name: credential?.user?.displayName,
        email: credential?.user?.email,
        image: credential?.user?.photoURL,
      };

      //Lock user
      const tracking = await trackLogin(email, true);

      if (trackLogin?.message !== "Failed attempt updated") {
        // save user Data
        await SaveUserInDb(updateUser);
        navigate(location.state || "/");
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${credential.user?.displayName}!`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {

      //Lock user
      await trackLogin(email, false);

      if(!checkUserAccount?.allowed) return
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Incorrect email or password.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl px-10 py-12 w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome Back</h2>
        <p className="text-gray-600">Please enter your credentials to login</p>
      </div>

      <LoginForm onSubmit={onSubmit} />

      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <SocialLogin />
      <br />
      <GithubLogin></GithubLogin>

      <p className="text-center mt-6">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-black font-medium underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
