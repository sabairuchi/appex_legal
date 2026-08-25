import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-icon">A</div>
          <div>
            <span className="admin-brand-title">APEX LEGAL</span>
            <span className="admin-brand-subtitle">ADMIN CONSOLE</span>
          </div>
        </div>

        <ul className="admin-nav-links">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">👥</span>
              <span>User Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/lawyers"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">⚖️</span>
              <span>Lawyer Roster</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/appointments"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">📅</span>
              <span>Appointments</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">📈</span>
              <span>Analytics</span>
            </NavLink>
          </li>
        </ul>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{getInitials(user?.fullName)}</div>
            <div>
              <div className="admin-user-name">{user?.fullName || 'Admin User'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Log Out">
            🚪
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <button
            className="admin-mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar Menu"
          >
            ☰
          </button>
          <div className="admin-page-title">Executive Administration Console</div>
          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            System Status: <span style={{ color: '#16A34A', fontWeight: 600 }}>● Live & Operational</span>
          </div>
        </header>

        <main className="admin-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
