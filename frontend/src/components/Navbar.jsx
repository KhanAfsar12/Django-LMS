import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, FileText, User, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}>
            <BookOpen size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Django LMS
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginTop: '-4px' }}>
              Learn & Elevate
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontWeight: 600, 
              fontSize: '0.9rem',
              color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            <BookOpen size={17} />
            Courses
          </Link>

          <Link 
            to="/extract-resume" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontWeight: 600, 
              fontSize: '0.9rem',
              color: isActive('/extract-resume') ? '#ec4899' : 'var(--text-muted)',
              transition: 'color 0.2s'
            }}
          >
            <Sparkles size={17} color="#ec4899" />
            AI Resume Analyzer
          </Link>

          {user && (
            <Link 
              to={`/profile/${user.username}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontWeight: 600, 
                fontSize: '0.9rem',
                color: location.pathname.startsWith('/profile') ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'color 0.2s'
              }}
            >
              <User size={17} />
              My Profile
            </Link>
          )}
        </nav>

        {/* Actions / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right', display: 'none', smDisplay: 'block' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>{user.first_name || user.username}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user.email || 'Student'}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
                <LogIn size={16} />
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
                <UserPlus size={16} />
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
