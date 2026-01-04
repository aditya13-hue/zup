import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ArrowLeft, Mail } from 'lucide-react';
import Logo from '../components/Logo';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <div className="split-layout">

            {/* Left Section - Light Mode Editorial */}
            <div style={{ background: 'var(--color-light)', padding: '60px', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Logo size={24} color="black" />
                    <span style={{ fontWeight: '800' }}>ZUP.</span>
                </div>

                <div>
                    <div className="label-text" style={{ color: 'black', borderBottom: '1px solid black', paddingBottom: '10px', marginBottom: '40px' }}>
                        Account Recovery
                    </div>
                    <h1 style={{ fontSize: '4rem', lineHeight: '1', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
                        DON'T<br />WORRY.<br />WE GOT<br />YOU.
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <p style={{ maxWidth: '250px', fontSize: '0.85rem', fontWeight: '500' }}>
                        It happens to the best of us. We'll send you a secure link to get you back on track.
                    </p>
                </div>
            </div>

            {/* Right Section - Dark Mode Form */}
            <div style={{ background: 'var(--color-bg)', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-reveal" style={{
                    width: '100%',
                    maxWidth: '480px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px'
                }}>

                    {!sent ? (
                        <>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>RESET PASSWORD</h2>
                            <p style={{ color: '#888', marginBottom: '3rem' }}>Enter the email address associated with your Zup ID.</p>

                            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} autoComplete="off">

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

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
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
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-accent)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'white'; }}
                                    >
                                        {loading ? <Loader2 className="spin" size={20} /> : 'SEND RESET LINK'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '10px' }}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px auto' }}>
                                <Mail size={40} color="black" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>CHECK YOUR MAIL</h2>
                            <p style={{ color: '#ccc', marginBottom: '40px', lineHeight: '1.6' }}>
                                We've sent a password reset link to your email address. It should arrive instantly.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn"
                                style={{ width: '100%', padding: '20px', borderRadius: '8px' }}
                            >
                                Return to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ForgotPasswordPage;
