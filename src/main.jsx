import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import MainRoute from "./router/MainRoute.jsx";
import { FirebaseContext } from "./context/AuthContext/FirebaseContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FirebaseContext>
      <RouterProvider router={MainRoute} />
    </FirebaseContext>
  </StrictMode>
);
