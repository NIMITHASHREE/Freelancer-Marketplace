import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';

export default function PostProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', budgetType: 'FIXED',
    budgetMin: '', budgetMax: '', deadline: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await projectAPI.create({
        ...form,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
      });
      navigate(`/projects/${data.projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post project');
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Post a new project</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="title" placeholder="Project title" value={form.title}
               onChange={handleChange} required />
        <textarea name="description" placeholder="Describe the project..." rows={5}
                  value={form.description} onChange={handleChange} required />
        <select name="budgetType" value={form.budgetType} onChange={handleChange}>
          <option value="FIXED">Fixed price</option>
          <option value="HOURLY">Hourly rate</option>
        </select>
        <div style={{ display: 'flex', gap: 12 }}>
          <input name="budgetMin" type="number" placeholder="Budget min (₹)"
                 value={form.budgetMin} onChange={handleChange} required />
          <input name="budgetMax" type="number" placeholder="Budget max (₹)"
                 value={form.budgetMax} onChange={handleChange} required />
        </div>
        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        <button type="submit" style={{ padding: '10px', background: '#e94560', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Post Project
        </button>
      </form>
    </div>
  );
}

