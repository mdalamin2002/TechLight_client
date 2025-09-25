import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openIndex: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    toggleFAQ: (state, action) => {
      state.openIndex =
        state.openIndex === action.payload ? null : action.payload;
    },
    closeFAQ: (state) => {
      state.openIndex = null;
    },
  },
});

export const { toggleFAQ, closeFAQ } = faqSlice.actions;
export default faqSlice.reducer;
