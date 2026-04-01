import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import PostProject from './pages/PostProject';
import MyProjects from './pages/MyProjects';
import MyBids from './pages/MyBids';
import ContractDetail    from './pages/ContractDetail';
import SubRequirementList from './pages/SubRequirementList';


// Route guard: redirect to /login if not authenticated
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
          <Routes>
            <Route path="/"               element={<ProjectList />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/projects/:id"   element={<ProjectDetail />} />
            <Route path="/post-project"   element={<PrivateRoute><PostProject /></PrivateRoute>} />
            <Route path="/my-projects"    element={<PrivateRoute><MyProjects /></PrivateRoute>} />
            <Route path="/my-bids"        element={<PrivateRoute><MyBids /></PrivateRoute>} />
            <Route path="/contracts/:contractId" element={<PrivateRoute><ContractDetail /></PrivateRoute>} />
            <Route path="/sub-requirements"      element={<SubRequirementList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
