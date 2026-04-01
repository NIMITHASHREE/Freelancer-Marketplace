/*import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectAPI.getMy().then(({ data }) => setProjects(data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>My Projects</h2>
      <Link to="/post-project" style={{ display: 'inline-block', marginBottom: 16,
        padding: '8px 18px', background: '#e94560', color: '#fff',
        textDecoration: 'none', borderRadius: 6 }}>
        + Post New Project
      </Link>
      {projects.length === 0 ? <p>No projects posted yet.</p> :
        projects.map((p) => (
          <Link to={`/projects/${p.projectId}`} key={p.projectId}
                style={{ display: 'block', border: '1px solid #ddd', borderRadius: 8,
                         padding: 14, marginBottom: 10, textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ margin: '0 0 4px' }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#777' }}>
              Status: {p.status} &nbsp;|&nbsp; Proposals: {p.proposalsCount}
            </p>
          </Link>
          
        ))
      }
    </div>
  );
}*/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectAPI.getMy().then(({ data }) => setProjects(data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>My Projects</h2>
      <Link to="/post-project" style={{ 
        display: 'inline-block', marginBottom: 16,
        padding: '8px 18px', background: '#e94560', color: '#fff',
        textDecoration: 'none', borderRadius: 6 
      }}>
        + Post New Project
      </Link>
      
      {projects.length === 0 ? <p>No projects posted yet.</p> :
        projects.map((p) => (
          <Link to={`/projects/${p.projectId}`} key={p.projectId}
                style={{ display: 'block', border: '1px solid #ddd', borderRadius: 8,
                         padding: 14, marginBottom: 10, textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ margin: '0 0 4px' }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#777' }}>
              Status: {p.status} &nbsp;|&nbsp; Proposals: {p.proposalsCount}
            </p>

            {/* Link to contract if it exists */}
            {p.contractId && (
              <div style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 8 }}>
                <Link 
                  to={`/contracts/${p.contractId}`} 
                  onClick={(e) => e.stopPropagation()} 
                  style={{ fontSize: 13, color: '#e94560', fontWeight: 'bold', textDecoration: 'none' }}
                >
                  View contract & milestones →
                </Link>
              </div>
            )}
          </Link>
        ))
      }
    </div>
  );
}
