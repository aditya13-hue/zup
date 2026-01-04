import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup, loginWithGoogle } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(email, password);
            navigate('/scanner');
        } catch (err) {
            setError('Failed to create account. Email may already be in use.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            navigate('/scanner');
        } catch (err) {
            setError('Failed to sign up with Google.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Section - Light Mode Editorial (Hidden on mobile) */}
            <div className="auth-padding mobile-hide" style={{ background: 'var(--color-light)', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Logo size={24} color="black" />
                    <span style={{ fontWeight: '800' }}>ZUPP.</span>
                </div>

                <div>
                    <div className="label-text" style={{ color: 'black', borderBottom: '1px solid black', paddingBottom: '10px', marginBottom: '40px' }}>
                        New Account / Registration
                    </div>
                    <h1 style={{ fontSize: '4rem', lineHeight: '1', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
                        JOIN THE<br />REVOLUTION.
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-bg)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star fill="currentColor" />
                    </div>
                    <p style={{ maxWidth: '200px', fontSize: '0.85rem', fontWeight: '500' }}>
                        Create a Zupp ID to access 100+ automated stores worldwide.
                    </p>
                </div>
            </div>

            {/* Right Section - Dark Mode Form */}
            <div className="auth-padding" style={{ background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-reveal" style={{
                    width: '100%',
                    maxWidth: '480px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '3rem', letterSpacing: '-0.02em' }}>GET STARTED</h2>

                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} autoComplete="off">
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.8rem', display: 'block', letterSpacing: '0.1em', fontWeight: 'bold' }}>FULL NAME</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    fontSize: '1.2rem',
                                    padding: '15px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    width: '100%'
                                }}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.8rem', display: 'block', letterSpacing: '0.1em', fontWeight: 'bold' }}>EMAIL ADDRESS</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    fontSize: '1.2rem',
                                    padding: '15px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    width: '100%'
                                }}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.8rem', display: 'block', letterSpacing: '0.1em', fontWeight: 'bold' }}>PASSWORD</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    fontSize: '1.2rem',
                                    padding: '15px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    width: '100%'
                                }}
                                autoComplete="new-password"
                            />
                        </div>

                        {error && (
                            <div style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                background: 'var(--color-accent)',
                                color: 'black',
                                border: 'none',
                                padding: '20px',
                                fontSize: '1rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                borderRadius: '8px',
                                boxShadow: '0 0 20px rgba(204, 255, 0, 0.2)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 0 40px rgba(204, 255, 0, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(204, 255, 0, 0.2)';
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Loader2 className="spin" size={20} /> INITIALIZING...
                                </span>
                            ) : (
                                <>
                                    CREATE ACCOUNT <ArrowRight size={24} />
                                </>
                            )}
                        </button>

                        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', margin: '1rem 0' }}>OR</div>

                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="btn btn-outline"
                            style={{
                                width: '100%',
                                padding: '15px',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                            <span>Continue with Google</span>
                        </button>
                    </form>

                    <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                            Already a member? <span onClick={() => navigate('/login')} style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>Sign In to Zupp</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                input::placeholder { color: #333; }
            `}</style>

        </div>
    );
};

export default SignupPage;
