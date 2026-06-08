import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PendingApproval from './pages/PendingApproval';
import Blocked from './pages/Blocked';
import Dashboard from './pages/Dashboard';
import UserRankingsPage from './pages/UserRankingsPage';
import UserResultsPage from './pages/UserResultsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMatchdays from './pages/admin/AdminMatchdays';
import AdminMatches from './pages/admin/AdminMatches';
import AdminRankings from './pages/admin/AdminRankings';
import AdminResults from './pages/admin/AdminResults';
import AdminEconomics from './pages/admin/AdminEconomics';
import AdminAudit from './pages/admin/AdminAudit';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles, allowedStatuses }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  if (allowedStatuses && !allowedStatuses.includes(currentUser.status)) {
    if (currentUser.status === 'PENDIENTE') return <Navigate to="/pending" replace />;
    if (currentUser.status === 'BLOQUEADO') return <Navigate to="/blocked" replace />;
  }

  return children;
};

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          currentUser ? (
            currentUser.role === 'admin' ? <Navigate to="/admin" /> : 
            currentUser.status === 'ACTIVO' ? <Navigate to="/dashboard" /> :
            currentUser.status === 'PENDIENTE' ? <Navigate to="/pending" /> :
            <Navigate to="/blocked" />
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/pending" element={
          <ProtectedRoute allowedStatuses={['PENDIENTE', 'ACTIVO', 'BLOQUEADO']}>
            <PendingApproval />
          </ProtectedRoute>
        } />
        
        <Route path="/blocked" element={
          <ProtectedRoute allowedStatuses={['BLOQUEADO', 'ACTIVO']}>
            <Blocked />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user']} allowedStatuses={['ACTIVO']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/rankings" element={
          <ProtectedRoute allowedRoles={['user']} allowedStatuses={['ACTIVO']}>
            <UserRankingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/resultados" element={
          <ProtectedRoute allowedRoles={['user']} allowedStatuses={['ACTIVO']}>
            <UserResultsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="matchdays" element={<AdminMatchdays />} />
          <Route path="matches" element={<AdminMatches />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="economics" element={<AdminEconomics />} />
          <Route path="rankings" element={<AdminRankings />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
