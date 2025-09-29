import React from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const result = await dispatch(loginWithGoogle());
    if (loginWithGoogle.fulfilled.match(result)) {
      navigate("/");
    } else {
      console.error("Google login failed:", result.payload);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full mt-2 py-3 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
      type="button"
    >
      Sign in with Google
    </button>
  );
};

export default SocialLogin;
