
import { createSlice } from "@reduxjs/toolkit";
import zxcvbn from "zxcvbn";

const passwordStrengthSlice = createSlice({
  name: "passwordStrength",
  initialState: {
    password: "",
    score: 0,
  },
  reducers: {
    updatePassword: (state, action) => {
      const result = zxcvbn(action.payload);
      state.password = action.payload;
      state.score = result.score;
    },
  },
});

export const { updatePassword } = passwordStrengthSlice.actions;
export default passwordStrengthSlice.reducer;
