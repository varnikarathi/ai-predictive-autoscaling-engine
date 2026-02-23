import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LiveDashboard from './pages/LiveDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LiveDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;


