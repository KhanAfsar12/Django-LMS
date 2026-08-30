import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { User, BookOpen, Award, CheckCircle2, Star, Megaphone } from 'lucide-react';

const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await client.get(`/profile/${username}/`);
      setProfileData(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading profile...</div>;
  }

  if (!profileData) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>User profile not found.</div>;
  }

  const { enrollments, courses_created, reviews, exam_results } = profileData;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'white',
          boxShadow: 'var(--accent-glow)'
        }}>
          {profileData.first_name ? profileData.first_name[0].toUpperCase() : profileData.username[0].toUpperCase()}
        </div>

        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {profileData.first_name} {profileData.last_name} (@{profileData.username})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{profileData.email || 'Student Account'}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <span className="badge badge-purple"><BookOpen size={12} /> {enrollments?.length || 0} Enrolled Courses</span>
            <span className="badge badge-green"><Award size={12} /> {exam_results?.length || 0} Exams Completed</span>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left: Enrolled Courses */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            Enrolled Courses
          </h2>

          {enrollments?.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No enrolled courses yet.
            </div>
          ) : (
            enrollments?.map(item => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.course?.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Progress: {item.progress}%</p>
                </div>
                <Link to={`/ParticularCourse/${item.course?.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Continue
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Right Stats & Results */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            Exam Results
          </h2>

          {exam_results?.length === 0 ? (
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No exam results recorded.
            </div>
          ) : (
            exam_results?.map(res => (
              <div key={res.id} className="glass-panel" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>{res.exam?.title}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Score</span>
                  <span className="badge badge-green">{res.score} / 100</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
