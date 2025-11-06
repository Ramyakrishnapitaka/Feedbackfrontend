import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Signup from "./components/signup";
import User from "./components/feedback/feedbackreducer";
import Admin from "./components/admin/admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />, 
    children: [
      { index:true, element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "user", element: <User /> },
      { path: "admin", element: <Admin /> },
      { path: "*", element: <Login></Login> }, 
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
