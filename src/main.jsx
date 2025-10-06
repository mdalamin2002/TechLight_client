import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import MainRoute from "./router/MainRoute.jsx";
import store from "./store/store";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Provider store={store}>
        <RouterProvider router={MainRoute} />
      </Provider>
    </AuthProvider>
  </QueryClientProvider>
  </StrictMode>
);
