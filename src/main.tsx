import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from '@/pages/index.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <div>404 Not Found</div>
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
