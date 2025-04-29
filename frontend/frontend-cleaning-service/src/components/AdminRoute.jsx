import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
  return decoded?.role === 'admin' ? children : <Navigate to="/" replace />;
}

export default AdminRoute;
