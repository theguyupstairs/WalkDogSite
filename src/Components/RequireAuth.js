import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthContext, { AuthProvider } from '../Context/AuthProvider';
import { useContext, useState } from "react";

const RequireAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const location = useLocation();
    const [authStateFailed, setAuthStateFailed] = useState(true);

    return (
        auth?.user
        ? <Outlet/>
        : <Navigate to="/" state={location}></Navigate>
    )
}

export default RequireAuth;