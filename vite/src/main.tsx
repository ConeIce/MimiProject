import React from "react";
import ReactDOM from "react-dom/client";

import "../app/globals.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/DashboardPage.tsx";
import PrintPage from "./pages/Dashboard/PrintPage.tsx";
import ForgotPage from "./pages/Authentication/ForgotPage.tsx";
import LoginPage from "./pages/Authentication/LoginPage.tsx";
import RegisterPage from "./pages/Authentication/RegisterPage.tsx";
import AllPrintsPage from "./pages/Dashboard/AllPrintsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    children: [
      {
        path: "print",
        element: <PrintPage />,
      },
      {
        path: "all",
        element: <AllPrintsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

