import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';

const cardStyle = {
  border: '1px solid #ddd', borderRadius: 8, padding: 16,
  marginBottom: 12, textDecoration: 'none', color: 'inherit', display: 'block',
};

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(true);

  const fetchProjects = async (q) => {
    setLoading(true);
    try {
      const { data } = q
        ? await projectAPI.search(q)
        : await projectAPI.getOpen();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(''); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(query);
  };

  return (
    <div>
      <h2>Browse Projects</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
               placeholder="Search projects..." style={{ flex: 1, padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px', background: '#e94560',
                color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Search
        </button>
        {query && <button type="button" onClick={() => { setQuery(''); fetchProjects(''); }}
                  style={{ padding: '8px 12px', cursor: 'pointer' }}>Clear</button>}
      </form>

      {loading ? <p>Loading...</p> : projects.length === 0 ? <p>No projects found.</p> :
        projects.map((p) => (
          <Link to={`/projects/${p.projectId}`} key={p.projectId} style={cardStyle}>
            <h3 style={{ margin: '0 0 6px' }}>{p.title}</h3>
            <p style={{ color: '#555', margin: '0 0 8px', fontSize: 14 }}>
              {p.description.substring(0, 140)}...
            </p>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888' }}>
              <span>Budget: {p.budgetType} — ₹{p.budgetMin} – ₹{p.budgetMax}</span>
              <span>Proposals: {p.proposalsCount}</span>
              {p.deadline && <span>Deadline: {p.deadline}</span>}
            </div>
          </Link>
        ))
      }
    </div>
  );
}