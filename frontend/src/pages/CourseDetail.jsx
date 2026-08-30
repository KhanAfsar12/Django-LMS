import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { 
  BookOpen, Video, FileText, HelpCircle, Star, MessageSquare, 
  Megaphone, ArrowLeft, ChevronDown, ChevronUp, PlayCircle, Download
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'reviews' | 'announcements'

  // Video modal / player state
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Accordion open topic IDs
  const [openTopics, setOpenTopics] = useState({});

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get(`/ParticularCourse/${id}/`);
      setCourseData(response.data);
      // Open first topic by default if available
      if (response.data?.course?.topics?.length > 0) {
        setOpenTopics({ [response.data.course.topics[0].id]: true });
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You must be enrolled to view full course content.');
      } else {
        setError(err.response?.data?.message || 'Failed to load course details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicId) => {
    setOpenTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      return;
    }
    if (!reviewText.trim()) return;
    setReviewSubmitting(true);
    try {
      await client.post(`/courses/${id}/reviews/`, {
        rating,
        review_text: reviewText
      });
      setReviewText('');
      fetchCourseDetail(); // refresh reviews
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading course content...</div>;
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Unable to load course</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/" className="btn-secondary"><ArrowLeft size={16} /> Back to Courses</Link>
      </div>
    );
  }

  const { course, reviews, announcements, is_enrolled } = courseData || {};

  const handleEnrollClick = async () => {
    if (!user) {
      alert('Please log in to enroll in this course.');
      return;
    }
    try {
      const res = await client.post(`/enrollNow/${id}/`);
      alert(res.data.message);
      fetchCourseDetail();
    } catch (e) {
      alert('Enrollment failed.');
    }
  };

  return (
    <div>
      {/* Back Button */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-purple">
              {course?.company_name?.name || 'Standard Course'}
            </span>
            {is_enrolled ? (
              <span className="badge badge-green">Enrolled</span>
            ) : (
              <button onClick={handleEnrollClick} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
                Enroll Now
              </button>
            )}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
            {course?.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px', marginBottom: '1.25rem' }}>
            {course?.description}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
            <span><strong>Credits:</strong> {course?.credits}</span>
            <span><strong>Start Date:</strong> {course?.start_date}</span>
            <span><strong>Instructor:</strong> {course?.created_by?.username}</span>
          </div>
        </div>

        {course?.course_image && (
          <img 
            src={course.course_image} 
            alt={course.title} 
            style={{ width: '220px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
          />
        )}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('content')}
          style={{ 
            background: 'none', 
            color: activeTab === 'content' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontWeight: 700, 
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            borderBottom: activeTab === 'content' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <BookOpen size={18} /> Course Topics ({course?.topics?.length || 0})
        </button>

        <button 
          onClick={() => setActiveTab('reviews')}
          style={{ 
            background: 'none', 
            color: activeTab === 'reviews' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontWeight: 700, 
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Star size={18} /> Reviews ({reviews?.length || 0})
        </button>

        <button 
          onClick={() => setActiveTab('announcements')}
          style={{ 
            background: 'none', 
            color: activeTab === 'announcements' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontWeight: 700, 
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            borderBottom: activeTab === 'announcements' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Megaphone size={18} /> Announcements ({announcements?.length || 0})
        </button>
      </div>

      {/* Tab 1: Course Topics & Media Content */}
      {activeTab === 'content' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedVideo ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          
          {/* Topics List */}
          <div>
            {course?.topics?.length === 0 ? (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No topics published for this course yet.
              </div>
            ) : (
              course?.topics?.map((topic, index) => {
                const isOpen = !!openTopics[topic.id];
                return (
                  <div key={topic.id} className="glass-panel" style={{ marginBottom: '1.25rem', overflow: 'hidden' }}>
                    <div 
                      onClick={() => toggleTopic(topic.id)}
                      style={{ 
                        padding: '1.25rem 1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          Topic #{index + 1}
                        </span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{topic.title}</h3>
                        {topic.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{topic.description}</p>}
                      </div>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        
                        {/* Videos */}
                        {topic.videos?.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Video size={14} /> Video Lessons
                            </h4>
                            {topic.videos.map(vid => (
                              <div 
                                key={vid.id} 
                                onClick={() => setSelectedVideo(vid)}
                                style={{ 
                                  padding: '0.75rem 1rem', 
                                  borderRadius: 'var(--radius-sm)', 
                                  background: selectedVideo?.id === vid.id ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.2)',
                                  border: '1px solid var(--glass-border)',
                                  marginBottom: '0.5rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <PlayCircle size={18} color="var(--accent-primary)" />
                                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{vid.title}</span>
                                </div>
                                <span className="badge badge-purple">Watch</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* PDFs */}
                        {topic.pdfs?.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <FileText size={14} /> Documents & Notes
                            </h4>
                            {topic.pdfs.map(pdf => (
                              <div key={pdf.id} style={{ 
                                padding: '0.75rem 1rem', 
                                borderRadius: 'var(--radius-sm)', 
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--glass-border)',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <FileText size={18} color="#ec4899" />
                                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pdf.title || 'PDF Resource'}</span>
                                </div>
                                <a href={pdf.pdf_file} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                                  <Download size={14} /> Open PDF
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Exams */}
                        {topic.exams?.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <HelpCircle size={14} /> Assessments & Exams
                            </h4>
                            {topic.exams.map(exam => (
                              <div key={exam.id} style={{ 
                                padding: '0.75rem 1rem', 
                                borderRadius: 'var(--radius-sm)', 
                                background: 'rgba(16,185,129,0.1)',
                                border: '1px solid rgba(16,185,129,0.3)',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}>
                                <div>
                                  <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>{exam.title}</span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exam.description || 'Topic evaluation quiz'}</span>
                                </div>
                                <Link to={`/exam/${exam.id}`} className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                                  Take Quiz
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Video Player Box */}
          {selectedVideo && (
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '90px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Now Playing: {selectedVideo.title}</h3>
                <button onClick={() => setSelectedVideo(null)} className="btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>Close</button>
              </div>
              <video 
                controls 
                autoPlay 
                src={selectedVideo.video_file} 
                style={{ width: '100%', borderRadius: 'var(--radius-sm)', background: 'black' }}
              />
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Course Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ maxWidth: '800px' }}>
          {/* Post Review Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Rating (1 to 5 Stars)</label>
                <select 
                  className="form-input" 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: '150px' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                  <option value={3}>⭐⭐⭐ 3 Stars</option>
                  <option value={2}>⭐⭐ 2 Stars</option>
                  <option value={1}>⭐ 1 Star</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="Share your thoughts about this course..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={reviewSubmitting} className="btn-primary">
                {reviewSubmitting ? 'Posting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Existing Reviews */}
          {reviews?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(rev => (
              <div key={rev.id} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{rev.user?.username || 'Student'}</span>
                  <div style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>
                    {'⭐'.repeat(rev.rating)}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{rev.review_text}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.5rem' }}>
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Announcements */}
      {activeTab === 'announcements' && (
        <div style={{ maxWidth: '800px' }}>
          {announcements?.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No announcements posted for this course.
            </div>
          ) : (
            announcements.map(ann => (
              <div key={ann.id} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Megaphone size={18} color="var(--accent-primary)" />
                  <span style={{ fontWeight: 700 }}>Announcement by {ann.user?.username}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.5 }}>
                  {ann.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default CourseDetail;
