import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, forgotPassword } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const { email, password } = data;
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    } else {
      console.error("Login error:", resultAction.payload);
    }
  };

  const handleForgotPassword = async (email) => {
    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      alert("Check your email for the reset link.");
    } else {
      alert("Error: " + result.payload);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl px-10 py-12 w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome Back</h2>
        <p className="text-gray-600">Please enter your credentials to login</p>
      </div>

      <LoginForm
        onSubmit={onSubmit}
        error={error}
        forgotPassword={handleForgotPassword}
      />

      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <SocialLogin />

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
