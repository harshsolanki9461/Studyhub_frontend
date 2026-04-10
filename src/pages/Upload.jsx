import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('DSA');
  const [customSubject, setCustomSubject] = useState('');
  const [type, setType] = useState('pdf');
  const [desc, setDesc] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([{ q: '', options: ['', '', '', ''], ans: 0 }]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalSubject = subject === 'Other' ? customSubject : subject;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', finalSubject);
    formData.append('type', type);
    formData.append('desc', desc);
    
    if (type === 'video') {
       const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
       const match = videoLink.match(regExp);
       const extractedId = (match && match[2].length === 11) ? match[2] : videoLink;
       formData.append('videoId', extractedId);
    }
    
    if (type === 'mcq') {
       formData.append('questions', JSON.stringify(questions));
    }
    
    if (file) formData.append('file', file);

    try {
      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Material uploaded successfully!');
      navigate('/materials');
    } catch (err) {
      alert('Error uploading material');
    }
  };

  return (
    <div className="section">
      <div className="page-header">
        <div className="page-title">⬆️ Upload Material</div>
        <div className="page-subtitle">Add new study material</div>
      </div>

      <div className="upload-form">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="video">VIDEO</option>
                <option value="mcq">MCQ</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="DSA">DSA</option>
                <option value="DBMS">DBMS</option>
                <option value="CN">CN</option>
                <option value="OS">OS</option>
                <option value="COA">COA</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="AI">AI</option>
                <option value="Data Science">Data Science</option>
                <option value="Other">Other (Add new)</option>
              </select>
            </div>
            {subject === 'Other' && (
              <div className="form-group">
                <label className="form-label">Custom Subject Name</label>
                <input type="text" className="form-input" required placeholder="e.g. Graphic Design" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" style={{height:'80px'}} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          {type === 'video' && (
            <div className="form-group">
              <label className="form-label">YouTube Link (e.g. https://youtu.be/dQw4w9WgXcQ)</label>
              <input type="text" className="form-input" required value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
            </div>
          )}

          {type === 'pdf' && (
            <div className="form-group">
               <label className="form-label">File</label>
               <input type="file" required onChange={(e) => setFile(e.target.files[0])} style={{color: 'var(--text)'}} />
            </div>
          )}

          {type === 'mcq' && (
            <div className="form-group">
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                 <label className="form-label" style={{marginBottom: '0'}}>Quiz Questions</label>
                 <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                    const text = prompt("Paste your MCQ text here (Format: Q: Question A) Opt1 B) Opt2 C) Opt3 D) Opt4 Ans: A)");
                    if (text) {
                      const blocks = text.split(/\n\s*\n/);
                      const parsed = blocks.map(block => {
                        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
                        const qLine = lines.find(l => /^Q[:\d]/.test(l)) || lines[0];
                        const opts = lines.filter(l => /^[A-D][\.\)]/.test(l)).map(l => l.substring(2).trim());
                        const ansLine = lines.find(l => /^Ans/i.test(l));
                        const ansMap = { A: 0, B: 1, C: 2, D: 3 };
                        const ansChar = ansLine ? ansLine.match(/[A-D]/i)?.[0].toUpperCase() : 'A';
                        return { 
                          q: qLine.replace(/^Q[:\d]*\s*/, ''), 
                          options: opts.length >= 4 ? opts.slice(0, 4) : [...opts, ...Array(4 - opts.length).fill('')], 
                          ans: ansMap[ansChar] || 0 
                        };
                      });
                      setQuestions([...questions, ...parsed].filter(q => q.q));
                    }
                 }}>
                   🪄 Bulk Add from Text
                 </button>
               </div>
               {questions.map((q, qi) => (
                 <div key={qi} style={{background: 'var(--bg3)', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border)'}}>
                   <input type="text" className="form-input" placeholder={`Question ${qi + 1}`} value={q.q} onChange={(e) => { const n = [...questions]; n[qi].q = e.target.value; setQuestions(n); }} style={{marginBottom: '10px', fontWeight: '600'}} required />
                   <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                     {q.options.map((opt, oi) => (
                       <div key={oi} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                         <input type="radio" name={`ans-${qi}`} checked={q.ans === oi} onChange={() => { const n = [...questions]; n[qi].ans = oi; setQuestions(n); }} />
                         <input type="text" className="form-input" placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => { const n = [...questions]; n[qi].options[oi] = e.target.value; setQuestions(n); }} required />
                       </div>
                     ))}
                   </div>
                   <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                      <button type="button" className="btn btn-ghost btn-sm" style={{color: 'var(--danger)'}} onClick={() => setQuestions(questions.filter((_, i) => i !== qi))}>Delete</button>
                   </div>
                 </div>
               ))}
               <button type="button" className="btn btn-ghost" style={{width: '100%'}} onClick={() => setQuestions([...questions, { q: '', options: ['', '', '', ''], ans: 0 }])}>+ Add Empty Question</button>
            </div>
          )}

          <button type="submit" className="btn btn-accent" style={{marginTop: '16px'}}>Upload Material</button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
