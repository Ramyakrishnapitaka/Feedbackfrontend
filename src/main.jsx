// // // src/main.jsx or index.jsx
// // import { createRoot } from "react-dom/client";
// // import "./index.css";
// // import { createBrowserRouter, RouterProvider } from "react-router-dom";
// // import Navbar from "./components/navbar";

// // // import Login from "./components/Login.jsx";
// // // import Signup from "./components/Signup.jsx";
// // // import Feedback from "./components/feedback/feedbackreducer.jsx";
// // // import { Provider } from "react-redux";
// // // import store from "./components/store.js";
// // // import Admin from "./components/admin/Admin.jsx";

// // const router = createBrowserRouter([
// //   {
// //     path: "/",
// //     element: <Navbar></Navbar>
// //     // children: [
// //     //   {
// //     //     index: true,
// //     //     element: <Login />, // show login by default when app opens
// //     //   },
// //       // {
// //       //   path: "login",
// //       //   element: <Login />,
// //       // },
// //       // {
// //       //   path: "signup",
// //       //   element: <Signup />,
// //       // },
// //       // {
// //       //   path: "user",
// //       //   element: <Feedback />,
// //       // },
// //       // {
// //       //   path: "admin",
// //       //   element: <Admin />,
// //       // },
// //     //],
// //   },
// // ]);

// // createRoot(document.getElementById("root")).render(
// //   <Provider store={store}>
// //     <RouterProvider router={router} />
// //   </Provider>
// // );
// // src/main.jsx
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// // import store from "./components/store"; // make sure the path is correct
// import Navbar from "./components/navbar";
// import Login from "./components/login";
// import Signup from "./components/signup";
// import Feedback from "./components/feedback/feedbackreducer";
// import Admin from "./components/admin/admin";

// // Define routes
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Navbar />,
//     children:[
//       {
//         index:true,
//         element:<Login></Login>
//       },
//       {
//         path:"signup",
//         element:<Signup></Signup>
//       },
//       {
//         path:"user",
//         element:<Feedback></Feedback>
//       },
//       {
//         path:"admin",
//         element:<Admin></Admin>
//       }
//     ]
     
//   },
// ]);

// // Render
// createRoot(document.getElementById("root")).render(
//   // <Provider store={store}>
//     <RouterProvider router={router} />
//   // </Provider>
// );
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import User from "./components/feedback/feedbackreducer";
import Admin from "./components/admin/Admin";

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
