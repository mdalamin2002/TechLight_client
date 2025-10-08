import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const LoginForm = ({ onSubmit }) => { 
  const { forgotPassword } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchedEmail = watch("email");

   const handleForgot = async () => {
     if (!watchedEmail) return;
     console.log(watchedEmail);
     try {
       await forgotPassword(watchedEmail)
       Swal.fire({
      icon: "success",
      title: "Password reset email sent!",
      text: "Check your inbox and follow the link to reset your password.",
      timer: 5000,
    });
     } catch (error) {
      Swal.fire({
      icon: "error",
      title: "Something went wrong!",
      text: "Enter a valid email",
    });
     }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-6">
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className={`w-full px-4 py-3 rounded border ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className={`w-full px-4 py-3 rounded border ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password button */}
      <div className="mb-6 text-right">
        <button
          type="button"
          onClick={handleForgot}
          disabled={!watchedEmail}
          className={`text-sm cursor-pointer text-black underline ${
            !watchedEmail && "opacity-50 cursor-not-allowed"
          }`}
        >
          Forgot password?
        </button>
      </div>

      <FilledButton
         type="submit" className="w-full py-3 font-semibold text-white"
      >
        Login
      </FilledButton>
    </form>
  );
};

export default LoginForm;
