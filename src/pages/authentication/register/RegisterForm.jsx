import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import React from "react";
import { useForm } from "react-hook-form";

const RegisterForm = ({ onSubmit }) => {
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
          className={`w-full px-4 py-3 rounded border ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
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
          className={`w-full px-4 py-3 rounded border ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className={`w-full px-4 py-3 rounded border ${errors.password ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
          className={`w-full px-4 py-3 rounded border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
    
      <FilledButton type="submit" className="w-full py-3 font-semibold text-white">
        Register
      </FilledButton>

      <p className="text-red-600 mt-2"></p>
    </form>
  );
};

export default RegisterForm;
