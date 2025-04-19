import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";

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
            }
        ]
    }
])

export default routers;