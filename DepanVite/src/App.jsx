import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import DepanagePage from './pages/DepanagePage';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      {/* Auth routes sans sidebar */}
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignupPage />
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />

      {/* Pages après auth avec sidebar */}
      <Route
        path="/depanage"
        element={
          <MainLayout>
            <DepanagePage />
          </MainLayout>
        }
      />

      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;
