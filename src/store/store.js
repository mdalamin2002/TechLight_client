import { configureStore } from "@reduxjs/toolkit";
import passwordStrengthReducer from "./passwordStrengthSlice";
import authReducer from "./authSlice";
import faqReducer from "./faq/faqSlice";
import termsReducer from "./terms/termsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordStrength: passwordStrengthReducer,
    faq: faqReducer,
    terms: termsReducer,
  },
});

export default store;

