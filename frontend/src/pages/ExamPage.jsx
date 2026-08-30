import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { HelpCircle, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

const ExamPage = () => {
  const { exam_id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { [question_id]: { selected_choice_id, text } }
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    fetchExamDetails();
  }, [exam_id]);

  const fetchExamDetails = async () => {
    try {
      const res = await client.get(`/exam/${exam_id}/`);
      setExam(res.data);
    } catch (err) {
      console.error('Failed to load exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceSelect = (questionId, choiceId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { question_id: questionId, selected_choice_id: choiceId, text: null }
    }));
  };

  const handleTextChange = (questionId, textVal) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { question_id: questionId, selected_choice_id: null, text: textVal }
    }));
  };

  const handleSubmitExam = async (e) => {
    e.preventDefault();
    const formattedAnswers = Object.values(answers);
    try {
      const res = await client.post(`/exam/${exam_id}/`, {
        answers: formattedAnswers
      });
      setSubmitResult(res.data);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit exam. Please try again.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading assessment...</div>;
  }

  if (!exam) {
    return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Exam not found.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ background: 'rgba(16,185,129,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <HelpCircle size={24} color="#34d399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{exam.title}</h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assessment & Evaluation</span>
          </div>
        </div>
        {exam.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{exam.description}</p>}
      </div>

      {submitted ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="#34d399" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Exam Completed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {submitResult?.message || 'Your answers have been recorded successfully.'}
          </p>
          <p style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '2rem' }}>
            Answers Submitted: {submitResult?.saved_answers_count || Object.keys(answers).length}
          </p>
          <Link to="/" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitExam}>
          {exam.questions?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No questions found in this assessment.</p>
          ) : (
            exam.questions.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    Q{idx + 1}.
                  </span>
                  <div 
                    style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}
                    dangerouslySetInnerHTML={{ __html: q.text }} 
                  />
                </div>

                {q.is_multiple_choice ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    {q.choices?.map((c) => {
                      const isSelected = answers[q.id]?.selected_choice_id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => handleChoiceSelect(q.id, c.id)}
                          style={{
                            padding: '0.85rem 1.25rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ accentColor: 'var(--accent-primary)' }}
                          />
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{c.text}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Type your answer here..."
                    value={answers[q.id]?.text || ''}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    style={{ marginTop: '0.75rem' }}
                  />
                )}
              </div>
            ))
          )}

          <div style={{ textAlign: 'right', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              <Send size={18} /> Submit Assessment
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExamPage;
