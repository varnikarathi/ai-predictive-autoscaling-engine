import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function ProtectedRoute({ children, role }) {
    const { token, role: userRole } = useAuthStore();

    if (!token || (role && userRole !== role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
