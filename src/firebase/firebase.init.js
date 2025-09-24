
// const firebaseConfig = {
//   apiKey: "AIzaSyAvqn9J1gIRHvn7z0i0L-IXhaP-d_g0SsQ",
//   authDomain: "techlight-e-commerce.firebaseapp.com",
//   projectId: "techlight-e-commerce",
//   storageBucket: "techlight-e-commerce.firebasestorage.app",
//   messagingSenderId: "87688497494",
//   appId: "1:87688497494:web:1d927e801044c8f8362ef7",
// };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
