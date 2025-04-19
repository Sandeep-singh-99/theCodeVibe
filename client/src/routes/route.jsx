import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            }
        ]
    }
])

export default routers;