import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';
import api from './services/api';
import AllShipments from './pages/AllShipments';

import LandingPage  from './pages/landingPage';
import Auth         from './pages/Auth';
import Dashboard    from './pages/dashboard';
import BookShipment from './pages/BookShipment';
import Tracking     from './pages/Tracking';
import Carriers     from './pages/Carriers';
import Analytics    from './pages/Analytics';
import Billing      from './pages/Billing';
import Settings     from './pages/Settings';

const queryClient = new QueryClient();

const ThemeVars = () => (
  <style>{`
    :root,
    :root[data-theme="dark"] {
      --mv-bg: #0A0B0D;
      --mv-panel: #0D0F13;
      --mv-card: #111318;
      --mv-card-hover: #131620;
      --mv-border: #1A1F28;
      --mv-border-2: #22272F;
      --mv-text: #EEF2F6;
      --mv-paper: #D8E0E8;
      --mv-muted: #8494A8;
      --mv-dim: #5A6478;
      --mv-dimmer: #3D4655;
      --mv-yellow: #E8F400;
      --mv-yellow-text: #E8F400;
      --mv-yellow-contrast: #0A0B0D;
      --mv-green: #00D68A;
      --mv-red: #FF5C38;
      --mv-amber: #FFB020;
      --mv-blue: #4da6ff;
    }

    :root[data-theme="light"] {
      --mv-bg: #FFFFFF;
      --mv-panel: #F8FAFC;
      --mv-card: #FFFFFF;
      --mv-card-hover: #F1F5F9;
      --mv-border: #E2E8F0;
      --mv-border-2: #CBD5E1;
      --mv-text: #0F172A;
      --mv-paper: #1E293B;
      --mv-muted: #475569;
      --mv-dim: #64748B;
      --mv-dimmer: #94A3B8;
      --mv-yellow: #CADD00;
      --mv-yellow-text: #8A9100;
      --mv-yellow-contrast: #0A0B0D;
      --mv-green: #059669;
      --mv-red: #DC2626;
      --mv-amber: #D97706;
      --mv-blue: #2563EB;
    }

    html, body, #root {
      background: var(--mv-bg);
      color: var(--mv-text);
    }
  `}</style>
);

function PrivateRoute({ children }) {
  const token    = useStore((s) => s.token);
  const isLoaded = useStore((s) => s.isLoaded);
  if (!isLoaded) return null;
  return token ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const token    = useStore((s) => s.token);
  const isLoaded = useStore((s) => s.isLoaded);
  if (!isLoaded) return null;
  return !token ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { setAuth, logout, setLoaded } = useStore();
  const themeMode = useStore((s) => s.themeMode);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    setLoaded();
    return;
  }
  api.get('/auth/me')
    .then((res) => {
      setAuth(res.data.user, token);
    })
    .catch((err) => {
      // Token expired or invalid — clear it silently
      localStorage.removeItem('accessToken');
      logout();
    })
    .finally(() => {
      setLoaded();
    });
}, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeVars />
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--mv-card)',
              color:      'var(--mv-text)',
              border:     '1px solid var(--mv-border-2)',
            },
          }}
        />
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/auth"      element={<PublicRoute><Auth /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/book"      element={<PrivateRoute><BookShipment /></PrivateRoute>} />
          <Route path="/tracking"  element={<PrivateRoute><Tracking /></PrivateRoute>} />
          <Route path="/carriers"  element={<PrivateRoute><Carriers /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/billing"   element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/shipments" element={<PrivateRoute><AllShipments /></PrivateRoute>} />
          <Route path="/settings"  element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
