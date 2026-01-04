import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithGoogle } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/scanner');
        } catch (err) {
            setError('Failed to log in. Check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            navigate('/scanner');
        } catch (err) {
            setError('Failed to log in with Google.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-layout">

            {/* Left Section - Light Mode Editorial */}
            <div className="auth-padding" style={{ background: 'var(--color-light)', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Logo size={24} color="black" />
                    <span style={{ fontWeight: '800' }}>ZUP.</span>
                </div>

                <div>
                    <div className="label-text" style={{ color: 'black', borderBottom: '1px solid black', paddingBottom: '10px', marginBottom: '40px' }}>
                        System Access / V.2.0
                    </div>
                    <h1 style={{ fontSize: '4rem', lineHeight: '1', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
                        WELCOME<br />TO THE<br />SPEED<br />LANE.
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-bg)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star fill="currentColor" />
                    </div>
                    <p style={{ maxWidth: '200px', fontSize: '0.85rem', fontWeight: '500' }}>
                        Trusted by 10M+ users across the globe.
                    </p>
                </div>
            </div>

            <div className="auth-padding" style={{ background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-reveal" style={{
                    width: '100%',
                    maxWidth: '480px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '3rem', letterSpacing: '-0.02em' }}>MEMBER LOGIN</h2>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} autoComplete="off">
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.8rem', display: 'block', letterSpacing: '0.1em', fontWeight: 'bold' }}>EMAIL ADDRESS</label>
                            <input
                                type="email"
                                required
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
                            <div style={{ textAlign: 'right', marginTop: '12px' }}>
                                <span
                                    onClick={() => navigate('/forgot-password')}
                                    style={{ color: '#666', fontSize: '0.85rem', cursor: 'pointer', transition: '0.3s' }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'}
                                    onMouseOut={(e) => e.target.style.color = '#666'}
                                >
                                    Forgot Password?
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                background: 'white',
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
                                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.3)';
                                e.currentTarget.style.background = 'var(--color-accent)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Loader2 className="spin" size={20} /> AUTHENTICATING...
                                </span>
                            ) : (
                                <>
                                    ENTER APP <ArrowRight size={24} />
                                </>
                            )}
                        </button>

                        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', margin: '1rem 0' }}>OR</div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
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
                            <span>Sign in with Google</span>
                        </button>
                    </form>

                    <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                            New to Zup? <span onClick={() => navigate('/signup')} style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>Create an Account</span>
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

export default LoginPage;
