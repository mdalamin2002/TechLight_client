
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  terms: [
    {
      title: "1. Introduction",
      description:
        "Welcome to the TechLight website. These terms and conditions govern the use of our website and services. By using our platform, you agree to comply with these terms.",
    },
    {
      title: "2. Account & Registration",
      description:
        "You may need to create an account to access certain services.\n\nYou are responsible for keeping your account credentials confidential.\n\nTechLight reserves the right to suspend or delete any account without prior notice.",
    },
    {
      title: "3. Products & Pricing",
      description:
        "We strive to provide accurate descriptions and images of our products.\n\nA key feature of our platform is AI-driven dynamic pricing. This means prices may change based on market conditions.\n\nPlease verify the product price before finalizing any order.",
    },
    {
      title: "4. Orders & Payments",
      description:
        "Your order is treated as an offer to purchase. We reserve the right to accept or reject orders based on product availability.\n\nIf an order is cancelled or there's any issue, we will contact you.\n\nAll refund and payment processes are handled by our finance department.",
    },
    {
      title: "5. User Conduct",
      description:
        "Users must refrain from fraudulent activities or misuse of the platform.\n\nWhile posting reviews or comments, use of abusive language is strictly prohibited. Our moderation team actively monitors and may take necessary action.",
    },
    {
      title: "6. Intellectual Property",
      description:
        "All content on this website—including logos, text, and graphics—is the property of TechLight and is protected under applicable laws.",
    },
    {
      title: "7. Changes to Terms",
      description:
        "TechLight reserves the right to update or change these terms at any time. All changes will be published on the website.",
    },
  ],
};


export const termsSlice = createSlice({
  name: "terms",
  initialState,
  reducers: {},
});

export const selectTerms = (state) => state.terms.terms;

export default termsSlice.reducer;
