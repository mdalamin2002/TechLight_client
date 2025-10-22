import axios from "axios";
import Swal from "sweetalert2";

export const validPass = async (password, confirmPassword) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  if (!passwordRegex.test(password)) {
    await Swal.fire({
      icon: "error",
      title: "Invalid Password",
      text: "Password must include at least one lowercase letter, one uppercase letter, and one number.",
      footer: "Please try again",
    });
    return false
  }

  if (password.length < 6) {
    await Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Password must be at least 6 characters long",
      footer: "Try again",
    });
    return false
  }

  if (password !== confirmPassword) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Passwords do not match",
      footer: "Please try again",
    });
    return false
  }
  return true;
};

//save or update user
export const SaveUserInDb = async (userData) => {
   axios.post(`${import.meta.env.VITE_prod_baseURL}/users/auth/register`, userData);
};
