import { useDispatch, useSelector } from "react-redux";
import { loginUser, } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";

import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Link,
} from "@mui/material";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {  error, user } = useSelector((state) => state.auth);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    } else {
      console.error("Login error:", resultAction.payload);
    }
  };


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-xl rounded-xl px-10 py-12 w-full"
    >
      {/* Heading */}
      <div className="mb-8 text-center">
        <Typography variant="h4" className="font-bold mb-2 text-gray-800">
          Welcome Back
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Please enter your credentials to login
        </Typography>
      </div>

      {/* Email Field */}
      <div className="mb-6">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </div>

      {/* Forgot Password Link */}
      <div className="mb-6 text-right">
        <Link href="#" underline="hover" className="text-sm text-black">
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ py: 1.5, fontWeight: 600, fontSize: "1rem" }}
        className="bg-black hover:bg-black"
      >
        Login
      </Button>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {user && (
        <Typography variant="body2" color="green" sx={{ mt: 2 }}>
          ✅ Registration successful! Welcome, {user.displayName}
        </Typography>
      )}

      {/* Divider */}
      <Divider className="my-6">or</Divider>

      <SocialLogin />

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don’t have an account?{" "}
        <Link href="/auth/register" className="text-black font-medium">
          Sign up
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
