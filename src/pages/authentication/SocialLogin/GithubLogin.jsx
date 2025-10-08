import OutlineButton from "@/Components/Shared/Buttots/OutlineButton";
import useAuth from "@/hooks/useAuth";
import { SaveUserInDb } from "@/utils/ShareUtils";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const GithubLogin = () => {
  const [loading, setLoading] = useState(false);
  const { githubLogin, setUser } = useAuth();
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const result = await githubLogin();
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
        text: "You have successfully signed in with Github.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:  "Github sign-in failed. Please try again ",
      });
    } finally {
      setLoading(false);
    }
  };

    return (
      
    <OutlineButton
      onClick={handleGithubLogin}
      className="w-full mt-2 py-3 cursor-pointer border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
      type="button">
      Sign in with Github
    </OutlineButton>
  );
};

export default GithubLogin;
