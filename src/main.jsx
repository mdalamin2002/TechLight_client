import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import MainRoute from "./router/MainRoute.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { FirebaseContext } from "./context/AuthContext/FirebaseContext";
import { SocketProvider } from "./context/AuthContext/SocketContext/SocketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FirebaseContext>
        <SocketProvider>
          <RouterProvider router={MainRoute} />
        </SocketProvider>
      </FirebaseContext>
    </QueryClientProvider>
  </StrictMode>
);
