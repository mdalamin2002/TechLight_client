import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../../store/passwordStrengthSlice";
import { useForm } from "react-hook-form";
import { registerUser } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";


import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Link,
} from "@mui/material";

const getStrengthLabel = (score) => {
  switch (score) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "";
  }
};

const getStrengthColor = (score) => {
  switch (score) {
    case 0:
    case 1:
      return "red";
    case 2:
      return "orange";
    case 3:
      return "gold";
    case 4:
      return "green";
    default:
      return "gray";
  }
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {  error } = useSelector((state) => state.auth);
  const passwordScore = useSelector((state) => state.passwordStrength.score);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    dispatch(updatePassword(value));
    setValue("password", value, { shouldValidate: true });
  };

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


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-xl rounded-xl px-10 py-12 w-full"
    >
      {/* Heading */}
      <div className="mb-8 text-center">
        <Typography variant="h4" className="font-bold mb-2 text-gray-800">
          Create Account
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Sign up to get started
        </Typography>
      </div>

      {/* Name Field */}
      <div className="mb-6">
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </div>

      {/* Email Field */}
      <div className="mb-6">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </div>

      {/* Password Field */}
      <div className="mb-6">
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register("password", { required: "Password is required" })}
          onChange={handlePasswordChange}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <div className="mt-2">
          <div
            style={{
              height: "8px",
              width: "100%",
              borderRadius: "4px",
              backgroundColor: getStrengthColor(passwordScore),
            }}
          ></div>
          <p className="text-sm text-gray-600 mt-1">
            Strength: {getStrengthLabel(passwordScore)}
          </p>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="mb-6">
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={passwordScore < 2} // disable if password too weak
        sx={{ py: 1.5, fontWeight: 600, fontSize: "1rem" }}
        className="bg-black hover:bg-black"
      >
        Register
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Divider */}
      <Divider className="my-6">or</Divider>

      {/* Login prompt */}
      <Typography variant="body2" align="center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-black font-medium">
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
