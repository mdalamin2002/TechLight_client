import { configureStore } from "@reduxjs/toolkit";
import passwordStrengthReducer from "./passwordStrengthSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordStrength: passwordStrengthReducer,
  },
});

export default store;

