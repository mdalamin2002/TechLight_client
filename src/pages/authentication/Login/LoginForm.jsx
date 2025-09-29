import React from "react";
import { useForm } from "react-hook-form";

const LoginForm = ({ onSubmit, error }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchedEmail = watch("email");

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
          onClick={() => onSubmit.forgotPassword(watchedEmail)}
          disabled={!watchedEmail}
          className={`text-sm text-black underline ${
            !watchedEmail && "opacity-50 cursor-not-allowed"
          }`}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-gray-900 transition"
      >
        Login
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default LoginForm;
