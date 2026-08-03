import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Members from './pages/Members';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import { MembersProvider } from './context/MembersContext';
import { SiteContentProvider } from './context/SiteContentContext';
import './styles/global.css';

export default function App() {
  return (
    <SiteContentProvider>
      <MembersProvider>
        <Router>
          <Navbar />
          <LoginModal />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/login" element={<Login />} />
              <Route path="/members" element={<ErrorBoundary><Members /></ErrorBoundary>} />
              <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </MembersProvider>
    </SiteContentProvider>
  );
}
