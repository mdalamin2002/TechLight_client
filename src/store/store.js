import { configureStore } from "@reduxjs/toolkit";
import passwordStrengthReducer from "./passwordStrengthSlice";
import authReducer from "./authSlice";
import faqReducer from "./faq/faqSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordStrength: passwordStrengthReducer,
    faq: faqReducer,
  },
});

export default store;

