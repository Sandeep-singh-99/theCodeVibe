import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Setting from "../pages/Setting";
import EditProfile from "../pages/EditProfile";
import BookMark from "../pages/BookMark";
import Profile from "../pages/Profile";
import Message from "../pages/Message";
import ProtectedRoutes from "../components/ProtectedRoutes";
import PostView from "../pages/PostView";
import TrendingPost from "../pages/TrendingPost";
import UserProfile from "../pages/UserProfile";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "setting",
        element: (
          <ProtectedRoutes>
            <Setting />
          </ProtectedRoutes>
        ),
      },
      {
        path: "edit-profile",
        element: <ProtectedRoutes> <EditProfile /> </ProtectedRoutes> 
      },
      {
        path: "bookmark",
        element: (
          <ProtectedRoutes>
            <BookMark />
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "message",
        element: (
          <ProtectedRoutes>
            <Message />
          </ProtectedRoutes>
        ),
      },
      {
        path: "postView/:id",
        element: <PostView/>
      },
      {
        path: "trending",
        element: <TrendingPost/>
      },
      {
        path: "/user-profile/:id",
        element: <UserProfile/>
      }
    ],
  },
]);

export default routers;
