import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Setting from "../pages/Setting";
import EditProfile from "../pages/EditProfile";
import BookMark from "../pages/BookMark";
import Profile from "../pages/Profile";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "signup",
                element: <SignUp/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "setting",
                element: <Setting/>
            },
            {
                path: "edit-profile",
                element: <EditProfile/>
            },
            {
                path: "bookmark",
                element: <BookMark/>
            },
            {
                path: "profile",
                element: <Profile/>
            }
        ]
    }
])

export default routers;