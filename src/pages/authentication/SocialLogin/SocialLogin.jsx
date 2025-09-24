import React from "react";
import { Button } from "@mui/material";
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
    <Button
      onClick={handleGoogleLogin}
      variant="outlined"
      fullWidth
      sx={{ mt: 2 }}
    >
      Sign in with Google
    </Button>
  );
};

export default SocialLogin;
