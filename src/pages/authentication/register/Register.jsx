import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "@/hooks/useAuth";
import { SaveUserInDb, validPass } from "@/utils/ShareUtils";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import GithubLogin from "../SocialLogin/GithubLogin";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { registerWithEmailPass,updateUser,logOutUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { name, email, password, confirmPassword } = data;
    
    try {
      // Valid password
      const passwordValidation = await validPass(password, confirmPassword);
      if (!passwordValidation) return;
      //Create user with email and password
      const credential = await registerWithEmailPass(email, password);
      const newUser = credential?.user;
      if (!newUser) throw new Error("User creation failed");
      //Update Profile
      await updateUser({ displayName: name, });
      const updatedUser = {
        name: newUser?.displayName,
        email:newUser?.email,
        image: newUser?.photoURL,
      };
      // save user Data
      await SaveUserInDb(updatedUser);
      logOutUser().then(() => {
        toast.success("Register successfully")
        navigate("/auth/login");
          });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: `This email already use`,
      });
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="bg-white shadow-xl rounded-xl px-10 py-12 w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Create Account</h2>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      <RegisterForm onSubmit={onSubmit} />

      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500">-</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <SocialLogin />
      <br />
      <GithubLogin></GithubLogin>

      <p className="text-center mt-6">
        Already have an account?{" "}
        <a href="/auth/login" className="text-black font-medium underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
