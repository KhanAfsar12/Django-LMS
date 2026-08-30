import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Sparkles, CheckCircle2, Building, Code, User, FileText } from 'lucide-react';

const ResumeExtractPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extractResume();
  }, []);

  const extractResume = async () => {
    setLoading(true);
    try {
      const res = await client.get('/extract-resume/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to extract resume details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem' }}>
          <Sparkles size={14} /> AI Powered Resume Parser
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Automated Resume Skill Extractor
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Uses NLP spaCy entity recognition to extract candidate names, technologies, and past companies.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--accent-primary)" /> Sample Resume Analysis
          </h2>
          <button onClick={extractResume} disabled={loading} className="btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            {loading ? 'Analyzing...' : 'Re-analyze'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Processing NLP model...
          </div>
        ) : data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Candidate Name */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <User size={14} /> Identified Candidate Name
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{data.name}</h3>
            </div>

            {/* Extracted Skills */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Code size={14} /> Key Technical Skills ({data.skills?.length || 0})
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.skills?.map((skill, index) => (
                  <span key={index} className="badge badge-purple" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={12} /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Companies */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Building size={14} /> Recognized Organizations & Companies
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.companies?.map((comp, index) => (
                  <span key={index} className="badge badge-blue" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                    {comp}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeExtractPage;
