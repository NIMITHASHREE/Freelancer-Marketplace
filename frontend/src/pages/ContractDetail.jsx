import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { milestoneAPI, subReqAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColor = {
  PENDING:   '#888',
  SUBMITTED: '#e6a817',
  APPROVED:  '#2ecc71',
  REJECTED:  '#e74c3c',
};

export default function ContractDetail() {
  const { contractId } = useParams();
  const { user } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [subReqs, setSubReqs]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [newMilestone, setNewMilestone] = useState({
    title: '', description: '', amount: '', dueDate: ''
  });
  const [newSubReq, setNewSubReq] = useState({
    title: '', description: '', categoryId: '', skillsNeeded: '',
    budgetMin: '', budgetMax: ''
  });
  const [showSubReqForm, setShowSubReqForm] = useState(false);
  const [error, setError] = useState('');

  const isClient     = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';

  useEffect(() => {
    milestoneAPI.getAll(contractId).then(r => setMilestones(r.data)).catch(() => {});
    subReqAPI.getForContract(contractId).then(r => setSubReqs(r.data)).catch(() => {});
    subReqAPI.getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, [contractId]);

  const progress = milestones.length === 0 ? 0
    : Math.round(milestones.filter(m => m.status === 'APPROVED').length * 100 / milestones.length);

  const handleCreateMilestone = async () => {
    try {
      const { data } = await milestoneAPI.create(contractId, {
        ...newMilestone,
        amount: parseFloat(newMilestone.amount),
      });
      setMilestones(prev => [...prev, data]);
      setNewMilestone({ title: '', description: '', amount: '', dueDate: '' });
    } catch { setError('Failed to create milestone'); }
  };

  const handleSubmit = async (id) => {
    const { data } = await milestoneAPI.submit(id);
    setMilestones(prev => prev.map(m => m.milestoneId === id ? data : m));
  };

  const handleApprove = async (id) => {
    const { data } = await milestoneAPI.approve(id);
    setMilestones(prev => prev.map(m => m.milestoneId === id ? data : m));
  };

  const handleReject = async (id) => {
    const { data } = await milestoneAPI.reject(id);
    setMilestones(prev => prev.map(m => m.milestoneId === id ? data : m));
  };

  const handleDelete = async (id) => {
    await milestoneAPI.delete(id);
    setMilestones(prev => prev.filter(m => m.milestoneId !== id));
  };

  const handleSaveEdit = async (id) => {
    const { data } = await milestoneAPI.update(id, {
      ...editForm,
      amount: parseFloat(editForm.amount),
    });
    setMilestones(prev => prev.map(m => m.milestoneId === id ? data : m));
    setEditingId(null);
  };

  const handleCreateSubReq = async () => {
    try {
      const { data } = await subReqAPI.create(contractId, {
        ...newSubReq,
        categoryId: newSubReq.categoryId ? parseInt(newSubReq.categoryId) : null,
        budgetMin: parseFloat(newSubReq.budgetMin),
        budgetMax: parseFloat(newSubReq.budgetMax),
      });
      setSubReqs(prev => [...prev, data]);
      setNewSubReq({ title:'', description:'', categoryId:'', skillsNeeded:'', budgetMin:'', budgetMax:'' });
      setShowSubReqForm(false);
    } catch { setError('Failed to create sub-requirement'); }
  };

  const handleApproveSubReq = async (id) => {
    try {
      const { data } = await subReqAPI.approve(id);
      setSubReqs(prev => prev.map(s => s.subReqId === id ? data : s));
    } catch (e) { setError(e.response?.data?.message || 'Cannot approve'); }
  };

  const inp = {
    padding: '8px 10px', borderRadius: 6, fontSize: 13,
    border: '1px solid var(--color-border-secondary, #ccc)',
    background: 'transparent', color: 'inherit', width: '100%', boxSizing: 'border-box'
  };
  const btn = (bg='#e94560') => ({
    padding: '6px 14px', borderRadius: 6, border: 'none',
    background: bg, color: '#fff', cursor: 'pointer', fontSize: 13
  });

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 4 }}>Contract #{contractId}</h2>

      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
          <span>Overall progress</span><span>{progress}%</span>
        </div>
        <div style={{ height:10, background:'#e0e0e0', borderRadius:5 }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'#2ecc71',
                        borderRadius:5, transition:'width .4s' }}/>
        </div>
      </div>

      {error && <p style={{ color:'red', marginBottom:12 }}>{error}</p>}

      {/* Milestones */}
      <h3>Milestones</h3>
      {milestones.map(m => (
        <div key={m.milestoneId} style={{
          border:'1px solid #ddd', borderRadius:8, padding:14, marginBottom:12
        }}>
          {editingId === m.milestoneId ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <input style={inp} value={editForm.title}
                onChange={e => setEditForm({...editForm, title:e.target.value})} placeholder="Title"/>
              <textarea style={inp} value={editForm.description}
                onChange={e => setEditForm({...editForm, description:e.target.value})} rows={2}/>
              <input style={inp} type="number" value={editForm.amount}
                onChange={e => setEditForm({...editForm, amount:e.target.value})} placeholder="Amount"/>
              <input style={inp} type="date" value={editForm.dueDate}
                onChange={e => setEditForm({...editForm, dueDate:e.target.value})}/>
              <div style={{ display:'flex', gap:8 }}>
                <button style={btn('#2ecc71')} onClick={() => handleSaveEdit(m.milestoneId)}>Save</button>
                <button style={btn('#888')} onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <strong>{m.title}</strong>
                <span style={{ background: statusColor[m.status], color:'#fff',
                               padding:'2px 10px', borderRadius:12, fontSize:12 }}>
                  {m.status}
                </span>
              </div>
              {m.description && <p style={{ fontSize:13, margin:'6px 0' }}>{m.description}</p>}
              <div style={{ fontSize:12, color:'#888', marginBottom:8 }}>
                {m.amount != null && <>₹{m.amount} &nbsp;·&nbsp;</>}
                {m.dueDate && <>Due: {m.dueDate}</>}
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {isFreelancer && m.status === 'PENDING' &&
                  <button style={btn()} onClick={() => handleSubmit(m.milestoneId)}>Mark complete</button>}
                {isClient && m.status === 'SUBMITTED' && <>
                  <button style={btn('#2ecc71')} onClick={() => handleApprove(m.milestoneId)}>Approve</button>
                  <button style={btn('#e74c3c')} onClick={() => handleReject(m.milestoneId)}>Reject</button>
                </>}
                {isClient && <>
                  <button style={btn('#3498db')} onClick={() => {
                    setEditingId(m.milestoneId);
                    setEditForm({ title:m.title, description:m.description||'',
                                  amount:m.amount||'', dueDate:m.dueDate||'' });
                  }}>Edit</button>
                  <button style={btn('#888')} onClick={() => handleDelete(m.milestoneId)}>Delete</button>
                </>}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add milestone (freelancer only) */}
      {isFreelancer && (
        <div style={{ border:'1px dashed #ccc', borderRadius:8, padding:14, marginBottom:28 }}>
          <strong style={{ fontSize:14 }}>Add milestone</strong>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
            <input style={inp} placeholder="Title" value={newMilestone.title}
              onChange={e => setNewMilestone({...newMilestone, title:e.target.value})}/>
            <textarea style={inp} placeholder="Description" rows={2} value={newMilestone.description}
              onChange={e => setNewMilestone({...newMilestone, description:e.target.value})}/>
            <input style={inp} type="number" placeholder="Amount" value={newMilestone.amount}
              onChange={e => setNewMilestone({...newMilestone, amount:e.target.value})}/>
            <input style={inp} type="date" value={newMilestone.dueDate}
              onChange={e => setNewMilestone({...newMilestone, dueDate:e.target.value})}/>
            <button style={btn()} onClick={handleCreateMilestone}>Add milestone</button>
          </div>
        </div>
      )}

      {/* Sub-requirements */}
      <h3>Additional freelancer requests</h3>
      {subReqs.map(sr => (
        <div key={sr.subReqId} style={{
          border:'1px solid #ddd', borderRadius:8, padding:14, marginBottom:12
        }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <strong>{sr.title}</strong>
            <span style={{
              background: sr.visibility === 'PUBLIC' ? '#2ecc71' : '#e6a817',
              color:'#fff', padding:'2px 10px', borderRadius:12, fontSize:12
            }}>
              {sr.approvalStatus === 'PENDING_APPROVAL' ? 'Awaiting approval'
               : sr.visibility === 'PUBLIC' ? 'Public' : sr.approvalStatus}
            </span>
          </div>
          <p style={{ fontSize:13, margin:'6px 0 4px' }}>{sr.description}</p>
          <div style={{ fontSize:12, color:'#888' }}>
            {sr.category?.name && <>{sr.category.name} &nbsp;·&nbsp;</>}
            {sr.skillsNeeded && <>{sr.skillsNeeded} &nbsp;·&nbsp;</>}
            {sr.budgetMin && sr.budgetMax && <>Budget: ₹{sr.budgetMin}–₹{sr.budgetMax}</>}
          </div>
          {/* Show approve button if pending and current user is NOT the initiator */}
          {sr.approvalStatus === 'PENDING_APPROVAL' &&
           user?.userId !== sr.initiatedBy && (
            <button style={{ ...btn('#2ecc71'), marginTop:8 }}
              onClick={() => handleApproveSubReq(sr.subReqId)}>
              Approve & post publicly
            </button>
          )}
        </div>
      ))}

      {/* Add sub-requirement */}
      <button style={{ ...btn('#3498db'), marginBottom:12 }}
        onClick={() => setShowSubReqForm(v => !v)}>
        {showSubReqForm ? 'Cancel' : '+ Request another freelancer'}
      </button>

      {showSubReqForm && (
        <div style={{ border:'1px dashed #3498db', borderRadius:8, padding:14, marginBottom:24 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input style={inp} placeholder="What do you need help with?" value={newSubReq.title}
              onChange={e => setNewSubReq({...newSubReq, title:e.target.value})}/>
            <textarea style={inp} placeholder="Describe the requirement" rows={3}
              value={newSubReq.description}
              onChange={e => setNewSubReq({...newSubReq, description:e.target.value})}/>
            <select style={inp} value={newSubReq.categoryId}
              onChange={e => setNewSubReq({...newSubReq, categoryId:e.target.value})}>
              <option value="">Select domain / category</option>
              {categories.map(c =>
                <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
            </select>
            <input style={inp} placeholder="Skills needed (e.g. React, Python)"
              value={newSubReq.skillsNeeded}
              onChange={e => setNewSubReq({...newSubReq, skillsNeeded:e.target.value})}/>
            <div style={{ display:'flex', gap:8 }}>
              <input style={inp} type="number" placeholder="Min budget"
                value={newSubReq.budgetMin}
                onChange={e => setNewSubReq({...newSubReq, budgetMin:e.target.value})}/>
              <input style={inp} type="number" placeholder="Max budget"
                value={newSubReq.budgetMax}
                onChange={e => setNewSubReq({...newSubReq, budgetMax:e.target.value})}/>
            </div>
            <button style={btn()} onClick={handleCreateSubReq}>Submit for approval</button>
          </div>
        </div>
      )}
    </div>
  );
}
