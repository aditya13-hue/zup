import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, Heart } from 'lucide-react';
import Logo from '../components/Logo';

const ManifestoPage = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: 'var(--color-bg)', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>

            <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 100, background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)' }}>
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Logo size={24} color="white" />
                    <span style={{ fontWeight: '800' }}>ZUP.</span>
                </div>
                <button onClick={() => navigate('/')} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', padding: '10px 20px', borderRadius: '50px' }}>
                    <ArrowLeft size={16} /> Back
                </button>
            </nav>

            <div className="page-container" style={{ padding: '160px 40px 80px 40px', maxWidth: '900px', margin: '0 auto' }}>

                <h1 className="hero-text" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '0.9', marginBottom: '60px', color: 'var(--color-accent)' }}>
                    THE PAUSE<br />MANIFESTO.
                </h1>

                <div style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#ccc' }}>
                    <p style={{ marginBottom: '40px', color: 'white', fontWeight: 'bold' }}>
                        We believe checkout shouldn't be a process.<br />It should be a pause.
                    </p>

                    <p style={{ marginBottom: '30px' }}>
                        In a world obsessed with speed, the retail experience has somehow gone backwards. We have self-driving cars and pocket supercomputers, yet we still stand in line to buy a bottle of water. We wait for the person in front to find their coupons. We wait for the card machine to connect. We wait.
                    </p>

                    <p style={{ marginBottom: '60px' }}>
                        Time is the only non-renewable resource we have. Squandering it in a queue isn't just inefficient—it's disrespectful to human life.
                    </p>

                    <hr style={{ borderColor: '#333', marginBottom: '60px' }} />

                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px', color: 'white' }}>OUR CORE BELIEFS</h2>

                    <div style={{ display: 'grid', gap: '40px' }}>

                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div style={{ minWidth: '60px', height: '60px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                <Clock size={30} color="var(--color-accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Speed is Respect</h3>
                                <p>By removing friction, we don't just save seconds. We save moments. Moments you can spend with family, on your work, or simply being present.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div style={{ minWidth: '60px', height: '60px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                <Zap size={30} color="var(--color-accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Technology Should Be Invisible</h3>
                                <p>The best technology gets out of the way. You shouldn't have to learn how to use Zup. It should just work. Scan. Pay. Go. As natural as breathing.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div style={{ minWidth: '60px', height: '60px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                <Heart size={30} color="var(--color-accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Empowering Local Commerce</h3>
                                <p>We're not here to replace the corner store. We're here to give them superpowers. Zup levels the playing field, allowing small businesses to offer the same seamless experience as tech giants.</p>
                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop: '100px', padding: '60px', background: '#111', borderRadius: '30px', border: '1px solid #333', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', color: 'white' }}>JOIN THE MOVEMENT.</h2>
                        <p style={{ marginBottom: '40px', fontSize: '1.1rem' }}>Be part of the future of retail. Whether you're a shopper or a shopkeeper, Zup is for you.</p>
                        <button onClick={() => navigate('/signup')} className="btn" style={{ padding: '20px 40px', fontSize: '1.1rem' }}>
                            Create Zup Account
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ManifestoPage;
