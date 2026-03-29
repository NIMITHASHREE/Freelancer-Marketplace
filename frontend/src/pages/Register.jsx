import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm]   = useState({ fullName: '', email: '', password: '',
                                        role: 'CLIENT', companyName: '', bio: '' });
  const [error, setError] = useState('');
  const { login }         = useAuth();
  const navigate          = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await authAPI.register(form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '48px auto' }}>
      <h2>Create account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="fullName" placeholder="Full name" value={form.fullName}
               onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email}
               onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 6 chars)"
               value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="CLIENT">I want to hire (Client)</option>
          <option value="FREELANCER">I want to work (Freelancer)</option>
        </select>
        {form.role === 'CLIENT' &&
          <input name="companyName" placeholder="Company name (optional)"
                 value={form.companyName} onChange={handleChange} />}
        {form.role === 'FREELANCER' &&
          <textarea name="bio" placeholder="Short bio (optional)" rows={3}
                    value={form.bio} onChange={handleChange} />}
        <button type="submit" style={{ padding: '10px', background: '#e94560', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}