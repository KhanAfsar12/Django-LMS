import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Search, BookOpen, Clock, Award, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await client.get('/');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId, e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to enroll in courses');
      return;
    }
    try {
      const res = await client.post(`/enrollNow/${courseId}/`);
      alert(res.data.message);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed.');
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: '2rem 0 3.5rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '1rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          <Sparkles size={14} /> Future-Ready Learning Management System
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Master New Skills with <br />
          <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Interactive & Structured Courses
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem' }}>
          Explore company-backed courses, participate in exams, track your progress, and analyze your career capabilities.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={20} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search courses, skills, topics..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: '3.2rem', 
              paddingRight: '1.2rem',
              height: '52px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '1rem',
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          />
        </div>
      </section>

      {/* Courses Grid */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Available Courses ({filteredCourses.length})
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No courses found matching your query.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {filteredCourses.map((course) => (
            <div key={course.id} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Image banner */}
              <div style={{ height: '180px', width: '100%', background: '#1e293b', overflow: 'hidden', position: 'relative' }}>
                {course.course_image ? (
                  <img src={course.course_image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.2)'
                  }}>
                    <BookOpen size={64} />
                  </div>
                )}
                {course.is_enrolled && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-green">
                      <CheckCircle2 size={12} /> Enrolled
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-blue">
                      <Award size={12} /> {course.credits} Credits
                    </span>
                    {course.company_name?.name && (
                      <span className="badge badge-purple">
                        {course.company_name.name}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {course.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.25rem' }}>
                    {course.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Start: {course.start_date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {course.is_enrolled ? (
                      <Link to={`/ParticularCourse/${course.id}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.88rem' }}>
                        Go to Class <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <>
                        <button onClick={(e) => handleEnroll(course.id, e)} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.88rem' }}>
                          Enroll Now
                        </button>
                        <Link to={`/ParticularCourse/${course.id}`} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.88rem' }}>
                          Preview
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
