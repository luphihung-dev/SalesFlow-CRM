import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ContactsPage from './pages/ContactsPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import DashboardPage from './pages/DashboardPage';
import DealsPage from './pages/DealsPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import TasksPage from './pages/TasksPage';
import { authStorage } from './api/auth';
import { canAccessSettings } from './utils/permissions';

function ProtectedRoute({ children }) {
  return authStorage.isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  return authStorage.isAuthenticated() && canAccessSettings() ? children : <Navigate to="/dashboard" replace />;
}

function Shell({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Shell><DashboardPage /></Shell>} />
      <Route path="/contacts" element={<Shell><ContactsPage /></Shell>} />
      <Route path="/contacts/:id" element={<Shell><CustomerDetailPage /></Shell>} />
      <Route path="/deals" element={<Shell><DealsPage /></Shell>} />
      <Route path="/tasks" element={<Shell><TasksPage /></Shell>} />
      <Route path="/settings" element={<Shell><AdminRoute><SettingsPage /></AdminRoute></Shell>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
