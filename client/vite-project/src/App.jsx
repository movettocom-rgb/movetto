import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';
import api from './services/api';

import LandingPage   from './pages/landingPage';
import Auth          from './pages/Auth';
import Dashboard     from './pages/dashboard';
import BookShipment  from './pages/BookShipment';
import Tracking      from './pages/Tracking';
import Carriers      from './pages/Carriers';
import Analytics     from './pages/Analytics';
import Billing       from './pages/Billing';
import Settings      from './pages/Settings';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const token = useStore((s) => s.token);
  const isLoaded = useStore((s) => s.isLoaded);
  if (!isLoaded) return null;
  return token ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const token = useStore((s) => s.token);
  const isLoaded = useStore((s) => s.isLoaded);
  if (!isLoaded) return null;
  return !token ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { setAuth, logout, setLoaded } = useStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoaded();
      return;
    }
    api.get('/auth/me')
      .then((res) => setAuth(res.data.user, token))
      .catch(() => logout())
      .finally(() => setLoaded());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111318',
              color: '#EEF2F6',
              border: '1px solid #22272F',
            },
          }}
        />
        <Routes>
          {/* Landing page — always public */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth — only if not logged in */}
          <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />

          {/* Private pages */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/book"      element={<PrivateRoute><BookShipment /></PrivateRoute>} />
          <Route path="/tracking"  element={<PrivateRoute><Tracking /></PrivateRoute>} />
          <Route path="/carriers"  element={<PrivateRoute><Carriers /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/billing"   element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/settings"  element={<PrivateRoute><Settings /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}