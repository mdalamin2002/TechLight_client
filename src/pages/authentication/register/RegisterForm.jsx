import React from "react";
import { useForm } from "react-hook-form";

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
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-400";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

const RegisterForm = ({ onSubmit, error, passwordScore, onPasswordChange }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Full Name"
          {...register("name", { required: "Name is required" })}
          className={`w-full px-4 py-3 rounded border ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-6">
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
          className={`w-full px-4 py-3 rounded border ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          onChange={onPasswordChange}
          className={`w-full px-4 py-3 rounded border ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        {/* Password strength bar */}
        <div className="w-full h-2 rounded mt-2 overflow-hidden bg-gray-300">
          <div
            className={`${getStrengthColor(passwordScore)} h-full w-full`}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Strength: {getStrengthLabel(passwordScore)}
        </p>
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          className={`w-full px-4 py-3 rounded border ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded font-semibold text-white ${
          passwordScore < 2
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-900"
        }`}
        disabled={passwordScore < 2}
      >
        Register
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default RegisterForm;
