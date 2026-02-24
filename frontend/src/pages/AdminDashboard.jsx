import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import AdminSection from '../components/AdminSection';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) return null;

    return (
        <AdminSection />
    );
}
