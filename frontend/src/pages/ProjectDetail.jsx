import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectAPI, bidAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id }                    = useParams();
  const { user }                  = useAuth();
  const [project, setProject]     = useState(null);
  const [bids, setBids]           = useState([]);
  const [bidForm, setBidForm]     = useState({ bidAmount: '', timelineDays: '', proposal: '' });
  const [message, setMessage]     = useState('');

  useEffect(() => {
    projectAPI.getById(id).then(({ data }) => setProject(data));
    if (user) bidAPI.getBids(id).then(({ data }) => setBids(data)).catch(() => {});
  }, [id, user]);

  const handleBid = async (e) => {
    e.preventDefault();
    try {
      await bidAPI.placeBid(id, bidForm);
      setMessage('Bid placed successfully!');
      const { data } = await bidAPI.getBids(id);
      setBids(data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleAccept = async (bidId) => {
    try {
      await bidAPI.acceptBid(bidId);
      setMessage('Bid accepted! Contract created.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error accepting bid');
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 760 }}>
      <h2>{project.title}</h2>
      <p style={{ color: '#555' }}>{project.description}</p>
      <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#777', marginBottom: 24 }}>
        <span>Type: {project.budgetType}</span>
        <span>Budget: ₹{project.budgetMin} – ₹{project.budgetMax}</span>
        <span>Status: {project.status}</span>
        {project.deadline && <span>Deadline: {project.deadline}</span>}
      </div>

      {/* Bid form — only for freelancers */}
      {user?.role === 'FREELANCER' && project.status === 'OPEN' && (
        <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0 }}>Place a bid</h3>
          {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
          <form onSubmit={handleBid} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="number" placeholder="Your bid amount (₹)"
                   value={bidForm.bidAmount}
                   onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                   required />
            <input type="number" placeholder="Timeline in days"
                   value={bidForm.timelineDays}
                   onChange={(e) => setBidForm({ ...bidForm, timelineDays: e.target.value })}
                   required />
            <textarea rows={4} placeholder="Write your proposal..."
                      value={bidForm.proposal}
                      onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })} />
            <button type="submit" style={{ padding: '10px', background: '#e94560', color: '#fff',
                    border: 'none', borderRadius: 6, cursor: 'pointer', width: 160 }}>
              Submit Bid
            </button>
          </form>
        </div>
      )}

      {/* Bids list — visible to the client who owns the project */}
      {user?.role === 'CLIENT' && (
        <div>
          <h3>Bids received ({bids.length})</h3>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {bids.map((b) => (
            <div key={b.bidId} style={{ border: '1px solid #ddd', borderRadius: 8,
                                        padding: 14, marginBottom: 10 }}>
              <p><strong>Amount:</strong> ₹{b.bidAmount} &nbsp;
                 <strong>Timeline:</strong> {b.timelineDays} days &nbsp;
                 <strong>Status:</strong> {b.status}</p>
              <p style={{ color: '#555', fontSize: 14 }}>{b.proposal}</p>
              {b.status === 'PENDING' && (
                <button onClick={() => handleAccept(b.bidId)}
                        style={{ background: '#27ae60', color: '#fff', border: 'none',
                                 borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>
                  Accept Bid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

