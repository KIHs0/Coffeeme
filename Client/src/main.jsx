import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/authentication/login.jsx";
import Signup from "./pages/authentication/signup.jsx";
import Home from "./pages/home/home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store2/store.js";
import { PageNotFound } from "./pages/xpages/pagenotfound.jsx";
import WelcomeScreen from "./utils/protectedRoutes.jsx";
import GuestRoute from "./utils/guest.jsx";
// ... normal setup, create store and persistor, import components etc.


const router = createBrowserRouter([
  {
    path: "/",
    element:
      <WelcomeScreen>
        < Home />
      </WelcomeScreen>
  },
  {
    path: "/login",
    element:
      <GuestRoute>

        <Login />
      </GuestRoute>
  },
  {
    path: "/signup",
    element: <  Signup />
  },
  {
    path: "*",
    element: <PageNotFound />
  },
])

createRoot(document.getElementById("root")).render(

  <Provider store={store}>
    <App />

    <RouterProvider router={router} />

  </Provider >
)
