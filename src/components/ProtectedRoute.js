import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx("div", { className: "p-6 text-center", children: "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u2026" });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
}
