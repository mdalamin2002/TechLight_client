import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import MainRoute from './router/MainRoute.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={MainRoute} />,
  </StrictMode>,
)
