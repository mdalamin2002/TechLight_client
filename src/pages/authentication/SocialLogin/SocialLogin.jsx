import useAuth from "@/hooks/useAuth";
import { SaveUserInDb } from "@/utils/ShareUtils";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);
  const {googleLogin,setUser } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      const updateUser = {
        name: result?.user?.displayName,
        email: result?.user?.email,
        image: result?.user?.photoURL,
      };
      // save user Data
      await SaveUserInDb(updateUser);
      setUser(result?.user);
      navigate("/");
      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "You have successfully signed in with Google.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Google sign-in failed.",
      });
    } finally {
      setLoading(false);
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
