import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav:    { background: '#1a1a2e', padding: '0 24px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', height: 56 },
  brand:  { color: '#e94560', textDecoration: 'none', fontWeight: 700, fontSize: 20 },
  links:  { display: 'flex', gap: 20, alignItems: 'center' },
  link:   { color: '#ccc', textDecoration: 'none', fontSize: 14 },
  btn:    { background: '#e94560', color: '#fff', border: 'none', borderRadius: 6,
            padding: '6px 16px', cursor: 'pointer', fontSize: 14 },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
};

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>FreelanceHub</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Browse Projects</Link>
        <Link to="/sub-requirements" style={styles.link}>Open Roles</Link>
        {user?.role === 'CLIENT' && <>
          <Link to="/post-project" style={styles.link}>Post Project</Link>
          <Link to="/my-projects"  style={styles.link}>My Projects</Link>
        </>}
        {user?.role === 'FREELANCER' && <>
          <Link to="/my-bids" style={styles.link}>My Bids</Link>
        </>}
        {user
          ? <button style={styles.btn} onClick={handleLogout}>Logout</button>
          : <>
              <Link to="/login"    style={styles.link}>Login</Link>
              <Link to="/register" style={{ ...styles.link }}>
                <button style={styles.btn}>Sign Up</button>
              </Link>
              
            </>
        }
        {user && <span style={{ color: '#aaa', fontSize: 13 }}>Hi, {user.fullName}</span>}
      </div>
    </nav>
  );
}
