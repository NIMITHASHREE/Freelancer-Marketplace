import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bidAPI } from '../services/api';

export default function MyBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    bidAPI.getMyBids().then(({ data }) => setBids(data)).catch(console.error);
  }, []);

  const statusColor = { PENDING: '#f39c12', ACCEPTED: '#27ae60',
                        REJECTED: '#e74c3c', WITHDRAWN: '#95a5a6' };

  return (
    <div>
      <h2>My Bids</h2>
      {bids.length === 0 ? <p>No bids placed yet.</p> :
        bids.map((b) => (
          <div key={b.bidId} style={{ border: '1px solid #ddd', borderRadius: 8,
                                      padding: 14, marginBottom: 10 }}>
            <Link to={`/projects/${b.project.projectId}`}>
              <strong>{b.project.title}</strong>
            </Link>
            <p style={{ margin: '6px 0', fontSize: 14, color: '#555' }}>
              Bid: ₹{b.bidAmount} &nbsp;|&nbsp; {b.timelineDays} days
            </p>
            <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 20,
                           background: statusColor[b.status] + '22',
                           color: statusColor[b.status], fontWeight: 600 }}>
              {b.status}
            </span>
          </div>
        ))
      }
    </div>
  );
}
