import React from "react";
import ReactDOM from "react-dom/client";

import "../app/globals.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardPage from "./pages/Dashboard/DashboardPage.tsx";
import PrintPage from "./pages/Dashboard/PrintPage.tsx";
import LoginPage from "./pages/Authentication/LoginPage.tsx";
import RegisterPage from "./pages/Authentication/RegisterPage.tsx";
import AllPrintsPage from "./pages/Dashboard/AllPrintsPage.tsx";
import AdminLogin from "./pages/Authentication/AdminAuth/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.tsx";
import PrintQueue from "./pages/AdminDashboard/PrintQueue.tsx";
import Dashboard from "./pages/AdminDashboard/Dashboard.tsx";
import AdminRegister from "./pages/Authentication/AdminAuth/AdminRegister.tsx";
import AdminWalkthrough from "./pages/Authentication/AdminAuth/AdminWalkthrough.tsx";
import AddShop from "./pages/AdminDashboard/AddShop.tsx";
import ClientLogin from "./pages/Authentication/ClientAuth/ClientLogin.tsx";
import ClientRegister from "./pages/Authentication/ClientAuth/ClientRegister.tsx";
import ClientWalkthrough from "./pages/Authentication/ClientAuth/ClientWalkthrough.tsx";
import ApproveRequest from "./pages/AdminDashboard/ApproveRequest.tsx";
import SettingsPage from "./pages/AdminDashboard/SettingsPage.tsx";
import Shop from "./pages/AdminDashboard/Shop.tsx";

const router = createBrowserRouter([
  // End-user routes
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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

  {
    path: "client/login",
    element: <ClientLogin />,
  },
  {
    path: "client/register",
    element: <ClientRegister />,
  },

  {
    path: "client/walkthrough",
    element: <ClientWalkthrough />,
  },

  {
    path: "admin/login",
    element: <AdminLogin />,
  },

  {
    path: "admin/register",
    element: <AdminRegister />,
  },

  {
    path: "admin/walkthrough",
    element: <AdminWalkthrough />,
  },

  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,

    children: [
      {
        path: "addShop",
        element: <AddShop />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "approveRequest",
        element: <ApproveRequest />,
      },
      {
        path: "print",
        element: <PrintQueue />,
      },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
