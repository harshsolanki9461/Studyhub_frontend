import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const QuizView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get('/materials');
                const q = res.data.find(m => m._id === id);
                setQuiz(q);
                // Record view
                api.post(`/materials/view/${id}`).catch(() => {});
            } catch (err) {}
        };
        fetchQuiz();
    }, [id]);

    if (!quiz) return <div className="section">Loading...</div>;

    const handleSubmit = async () => {
        let currentScore = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.ans) currentScore++;
        });
        setScore(currentScore);
        setSubmitted(true);
        try {
            await api.post(`/materials/quiz/${id}`, { score: currentScore, total: quiz.questions.length });
        } catch (err) {}
    };

    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);

    return (
        <div className="quiz-container section">
            {!submitted ? (
                <>
                    <div className="page-header">
                        <button className="btn btn-ghost btn-sm" style={{marginBottom:'12px'}} onClick={() => navigate('/materials')}>← Back</button>
                        <div className="page-title">{quiz.title}</div>
                        <div className="page-subtitle">Select the correct answer for each question.</div>
                    </div>

                    {quiz.questions && quiz.questions.map((q, qi) => (
                        <div key={qi} className="question-card">
                            <div className="question-text">Q{qi + 1}. {q.q}</div>
                            {q.options.map((opt, oi) => (
                                <button 
                                    key={oi} 
                                    className={`option-btn ${answers[qi] === oi ? 'selected' : ''}`}
                                    onClick={() => setAnswers(prev => ({...prev, [qi]: oi}))}
                                >
                                    {String.fromCharCode(65 + oi)}. {opt}
                                </button>
                            ))}
                        </div>
                    ))}
                    <button className="btn btn-accent" onClick={handleSubmit} style={{width: '100%', padding: '16px'}}>✅ Submit Quiz</button>
                </>
            ) : (
                <>
                    <div className="card" style={{textAlign:'center', marginBottom: '28px', border: '1px solid var(--accent)', background: 'rgba(255, 122, 0, 0.02)'}}>
                        <div style={{fontSize:'48px', marginBottom:'12px'}}>{pct >= 70 ? '🎉' : '📚'}</div>
                        <div style={{fontSize:'28px', fontWeight:'700', marginBottom:'8px'}}>{score}/{total} Correct</div>
                        <div style={{fontSize:'18px', color: pct >= 70 ? 'var(--success)' : 'var(--warning)', fontWeight:'600', marginBottom:'20px'}}>{pct}% Score</div>
                        <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                            <button className="btn btn-ghost" onClick={() => navigate('/materials')}>← Back to Materials</button>
                            <button className="btn btn-accent" onClick={() => { setAnswers({}); setSubmitted(false); }}>🔄 Retry Quiz</button>
                        </div>
                    </div>

                    <div className="page-header">
                        <div className="page-title">Review Answers</div>
                        <div className="page-subtitle">Check the correct answers below.</div>
                    </div>

                    {quiz.questions.map((q, qi) => (
                        <div key={qi} className="question-card" style={{ borderLeft: answers[qi] === q.ans ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
                            <div className="question-text">
                                <span style={{color: answers[qi] === q.ans ? 'var(--success)' : 'var(--danger)', marginRight: '8px'}}>
                                    {answers[qi] === q.ans ? '✓' : '✗'}
                                </span>
                                Q{qi + 1}. {q.q}
                            </div>
                            {q.options.map((opt, oi) => {
                                const isSelected = answers[qi] === oi;
                                const isCorrect = q.ans === oi;
                                let statusClass = '';
                                if (isSelected) statusClass = isCorrect ? 'correct' : 'wrong';
                                else if (isCorrect) statusClass = 'correct';

                                return (
                                    <div 
                                        key={oi} 
                                        className={`option-btn ${statusClass}`}
                                        style={{
                                            cursor: 'default',
                                            opacity: statusClass ? 1 : 0.6,
                                            borderStyle: (isCorrect && !isSelected) ? 'dashed' : 'solid'
                                        }}
                                    >
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                                            {isCorrect && <span style={{fontSize: '12px', fontWeight: '700'}}>CORRECT ANSWER</span>}
                                            {isSelected && !isCorrect && <span style={{fontSize: '12px', fontWeight: '700'}}>YOUR ANSWER</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default QuizView;
