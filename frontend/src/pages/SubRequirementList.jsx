import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subReqAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SubRequirementList() {
  const [items, setItems] = useState([]);
  const [bidForms, setBidForms] = useState({});
  const [submitted, setSubmitted] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    subReqAPI.getPublic().then(r => setItems(r.data)).catch(() => {});
  }, []);

  const handleBid = async (subReqId) => {
    const form = bidForms[subReqId] || {};
    try {
      await subReqAPI.placeBid(subReqId, {
        bidAmount: parseFloat(form.amount),
        proposal: form.proposal,
        deliveryDays: parseInt(form.days),
      });
      setSubmitted(prev => ({ ...prev, [subReqId]: true }));
    } catch { alert('Failed to place bid'); }
  };

  const inp = {
    padding: '7px 10px', borderRadius:6, fontSize:13, width:'100%',
    border:'1px solid var(--color-border-secondary, #ccc)',
    background:'transparent', color:'inherit', boxSizing:'border-box'
  };
  const btn = (bg='#e94560') => ({
    padding:'6px 14px', borderRadius:6, border:'none',
    background:bg, color:'#fff', cursor:'pointer', fontSize:13
  });

  return (
    <div style={{ maxWidth:760, margin:'0 auto' }}>
      <h2>Open sub-requirements</h2>
      <p style={{ fontSize:13, color:'#888', marginBottom:20 }}>
        Multi-disciplinary projects looking for additional freelancers.
      </p>
      {items.length === 0 && <p style={{ color:'#aaa' }}>No open sub-requirements right now.</p>}
      {items.map(sr => {
        const progress = sr.contract?.milestones
          ? Math.round(sr.contract.milestones.filter(m=>m.status==='APPROVED').length
              * 100 / (sr.contract.milestones.length||1))
          : null;
        const form = bidForms[sr.subReqId] || {};
        return (
          <div key={sr.subReqId} style={{
            border:'1px solid #ddd', borderRadius:10, padding:18, marginBottom:16
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <h3 style={{ margin:'0 0 4px' }}>{sr.title}</h3>
                <div style={{ fontSize:12, color:'#888', marginBottom:6 }}>
                  Project: <strong>{sr.project?.title}</strong>
                  {sr.category?.name && <> &nbsp;·&nbsp; Domain: <strong>{sr.category.name}</strong></>}
                </div>
              </div>
              {sr.budgetMin && sr.budgetMax && (
                <span style={{ fontSize:13, color:'#2ecc71', fontWeight:500 }}>
                  ₹{sr.budgetMin}–₹{sr.budgetMax}
                </span>
              )}
            </div>
            <p style={{ fontSize:13, margin:'0 0 8px' }}>{sr.description}</p>
            {sr.skillsNeeded && (
              <div style={{ fontSize:12, color:'#888', marginBottom:8 }}>
                Skills: {sr.skillsNeeded}
              </div>
            )}

            {/* Progress bar — no milestone details */}
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:3 }}>
                <span style={{ color:'#888' }}>Project progress</span>
                <span>{sr.progressPercent ?? 0}%</span>
              </div>
              <div style={{ height:6, background:'#e0e0e0', borderRadius:3 }}>
                <div style={{ height:'100%', width:`${sr.progressPercent ?? 0}%`,
                              background:'#2ecc71', borderRadius:3 }}/>
              </div>
            </div>

            {user?.role === 'FREELANCER' && !submitted[sr.subReqId] && (
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
                <div style={{ display:'flex', gap:8 }}>
                  <input style={inp} type="number" placeholder="Your bid (₹)"
                    value={form.amount||''}
                    onChange={e => setBidForms(p=>({...p,[sr.subReqId]:{...form,amount:e.target.value}}))}/>
                  <input style={inp} type="number" placeholder="Delivery days"
                    value={form.days||''}
                    onChange={e => setBidForms(p=>({...p,[sr.subReqId]:{...form,days:e.target.value}}))}/>
                </div>
                <textarea style={inp} rows={2} placeholder="Your proposal"
                  value={form.proposal||''}
                  onChange={e => setBidForms(p=>({...p,[sr.subReqId]:{...form,proposal:e.target.value}}))}/>
                <button style={btn()} onClick={() => handleBid(sr.subReqId)}>Place bid</button>
              </div>
            )}
            {submitted[sr.subReqId] && (
              <p style={{ color:'#2ecc71', fontSize:13 }}>Bid submitted!</p>
            )}
          </div>
        );
      })}
    </div>
  );
}