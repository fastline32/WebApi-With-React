import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../stores/store";

export default function RequireAuth() {
    const{userStore: {isLoggedin}} = useStore();
    const location = useLocation();

    if(!isLoggedin) {
        return <Navigate to='/' state={{from: location}} />
    }

    return <Outlet />
}