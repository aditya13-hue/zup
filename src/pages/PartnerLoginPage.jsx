import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

const PartnerLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/partner');
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: '"Outfit", sans-serif'
        }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                        <Logo size={40} color="var(--color-accent)" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '8px' }}>Partner Portal</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Secure access for Mart Owners</p>
                </div>

                {/* Form Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                    padding: '40px'
                }}>

                    {error && (
                        <div style={{
                            background: 'rgba(255,68,68,0.1)',
                            border: '1px solid rgba(255,68,68,0.2)',
                            color: '#ff4444',
                            padding: '12px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '20px'
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Business Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: '#0a0a0a',
                                    border: '1px solid #222',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                                placeholder="name@mart.com"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: '#0a0a0a',
                                    border: '1px solid #222',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '900',
                                cursor: 'pointer',
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Authenticating...' : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px', color: '#444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Lock size={12} /> Encrypted & Secure
                </div>

            </div>
        </div>
    );
};

export default PartnerLoginPage;
