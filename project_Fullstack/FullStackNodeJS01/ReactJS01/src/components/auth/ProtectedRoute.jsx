import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { AuthContext } from "../context/auth.context";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { auth, appLoading } = useContext(AuthContext);

    if (appLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Spin size="large" />
            </div>
        );
    }

    if (!auth?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(auth?.user?.role)) {
        return <Navigate to="/home" replace />;
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
