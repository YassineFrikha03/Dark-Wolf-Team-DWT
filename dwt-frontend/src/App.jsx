import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import MatchesPage from './pages/MatchesPage';
import ShopPage from './pages/ShopPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PlayerDashboardPage from './pages/PlayerDashboardPage';
import RandomBackground from './components/RandomBackground';

// Protection de l'espace joueur : redirection vers /login si déconnecté
const ProtectedPlayerRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Chargement...
      </div>
    );
  }
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protection de l'espace admin : redirection vers /login si déconnecté, ou vers accueil si non admin
const ProtectedAdminRoute = ({ children }) => {
  const { user, token, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Chargement...
      </div>
    );
  }
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            {/* Background aléatoire parmi les 4 photos de src/assets */}
            <RandomBackground />
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/a-propos" element={<AboutPage />} />
                <Route path="/equipe" element={<TeamPage />} />
                <Route path="/tournois" element={<MatchesPage />} />
                <Route path="/boutique" element={<ShopPage />} />
                <Route path="/actualites" element={<NewsPage />} />
                <Route path="/actualites/:id" element={<NewsDetailPage />} />
                <Route path="/actualite/:id" element={<NewsDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/recrutement" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboardPage />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route 
                  path="/espace-joueur" 
                  element={
                    <ProtectedPlayerRoute>
                      <PlayerDashboardPage />
                    </ProtectedPlayerRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
