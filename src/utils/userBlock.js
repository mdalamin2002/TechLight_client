import axios from "axios";
import Swal from "sweetalert2";

export const lockCheck = async (email) => {
  try {
    const checkLock = await axios.post(`${import.meta.env.VITE_prod_baseURL}/users/auth/checkLock`, { email });
    if (!checkLock.data.allowed) {
      Swal.fire({ icon: "error", title: "Login Failed", text: checkLock.data.message });
        return checkLock.data;
      }
      return checkLock.data
  } catch (error) {
    console.log(error);
  }
};

//Tracking Login
export const trackLogin = async (email,success) => {
  try {
      const tracking = await axios.post(`${import.meta.env.VITE_prod_baseURL}/users/auth/trackLogin`, { email, success: success });
      return tracking?.data
  } catch (error) {
    console.log(error);
  }
};
