import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import MainRoute from './router/MainRoute.jsx';
import store from './store/store';
import AuthProvider from './context/AuthContext/AuthProvider';
import { Provider } from 'react-redux';
import { SidebarProvider } from './Components/ui/sidebar';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SidebarProvider>
      <Provider store={store}>
        <RouterProvider router={MainRoute} />
        </Provider>
        </SidebarProvider>
    </AuthProvider>
  </StrictMode>
);

