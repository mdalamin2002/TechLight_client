import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../store/authSlice";
import { updatePassword } from "../../../store/passwordStrengthSlice";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const passwordScore = useSelector((state) => state.passwordStrength.score);

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    const resultAction = await dispatch(
      registerUser({ name, email, password })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/");
    } else {
      console.error("Registration error:", resultAction.payload);
    }
  };

  const handlePasswordChange = (e) => {
    dispatch(updatePassword(e.target.value));
  };

  return (
    <div className="bg-white shadow-xl rounded-xl px-10 py-12 w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Create Account
        </h2>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      <RegisterForm
        onSubmit={onSubmit}
        error={error}
        passwordScore={passwordScore}
        onPasswordChange={handlePasswordChange}
      />

      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500">-</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <SocialLogin />

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
