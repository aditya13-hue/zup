import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Globe, Shield, Smartphone, Briefcase, ShoppingBag, Check, Scan, Percent, DoorOpen, Camera } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage = () => {
    const navigate = useNavigate();
    const phoneRef = useRef(null);

    // Observer for "Text Reveal" and Scroll Sections
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.scroll-section, .text-reveal').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // 3D Phone Hover Logic
    const handleMouseMove = (e) => {
        if (!phoneRef.current) return;
        const rect = phoneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        phoneRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        if (phoneRef.current) phoneRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    // Scroll to Section Handler
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{ background: 'var(--color-bg)', color: 'white', overflowX: 'hidden' }}>

            {/* Sticky Nav */}
            <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 100, mixBlendMode: 'difference' }}>
                <div onClick={() => scrollToSection('home')} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.05em', cursor: 'pointer' }}>
                    <Logo size={28} color="white" />
                    <span>ZUP.</span>
                </div>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <button onClick={() => navigate('/login')} className="btn-outline" style={{ padding: '12px 24px', fontSize: '0.9rem', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Sign In
                    </button>
                </div>
            </nav>

            {/* --- SECTION 1: HERO --- */}
            <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
                <div className="page-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(300px, 0.8fr)', alignItems: 'center', gap: '60px' }}>

                    <div style={{ zIndex: 10 }}>
                        <div className="text-reveal label-text" style={{ marginBottom: '20px', color: 'var(--color-accent)' }}>FAST. SIMPLE. SECURE.</div>
                        <h1 className="hero-text" style={{ fontSize: 'clamp(4rem, 7vw, 8rem)', lineHeight: '0.9', marginBottom: '40px' }}>
                            <span className="text-reveal" style={{ transitionDelay: '0.1s' }}>RETAIL</span><br />
                            <span className="text-reveal" style={{ transitionDelay: '0.2s' }}>AT THE SPEED</span><br />
                            <span className="text-reveal" style={{ transitionDelay: '0.3s', color: 'var(--color-accent)' }}>OF LIFE.</span>
                        </h1>
                        <p className="scroll-section" style={{ maxWidth: '500px', fontSize: '1.5rem', color: '#fff', marginBottom: '40px', lineHeight: '1.4', fontStyle: 'italic' }}>
                            "Your Checkout is in Your Pocket."
                        </p>
                        <div className="scroll-section" style={{ display: 'flex', gap: '20px' }}>
                            <button onClick={() => navigate('/signup')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 36px', fontSize: '1.1rem', borderRadius: '4px' }}>
                                Get Started <ArrowRight size={22} />
                            </button>
                        </div>
                    </div>

                    {/* 3D Interactive Phone Zone */}
                    <div className="scroll-section" style={{ height: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        {/* PHONE MOCKUP CONTAINER */}
                        <div ref={phoneRef} style={{
                            width: '320px',
                            height: '640px',
                            background: '#000',
                            borderRadius: '50px',
                            position: 'relative',
                            zIndex: 2,
                            boxShadow: '0 50px 100px -20px black',
                            border: '8px solid #222',
                            padding: '12px',
                            transition: 'transform 0.1s ease-out',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Phone Bezel/Glow */}
                            <div style={{ position: 'absolute', inset: -4, borderRadius: '54px', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }}></div>

                            {/* Dynamic Island */}
                            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '25px', background: 'black', borderRadius: '20px', zIndex: 10 }}></div>

                            {/* SCREEN CONTENT */}
                            <div style={{ flex: 1, background: '#111', borderRadius: '38px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                {/* Status Bar */}
                                <div style={{ height: '50px', display: 'flex', justifyContent: 'space-between', padding: '15px 25px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    <span>9:41</span>
                                    <div style={{ display: 'flex', gap: '5px' }}><div style={{ width: '15px', height: '10px', background: 'white' }}></div></div>
                                </div>

                                {/* App UI - Scanner Mode */}
                                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    {/* Camera View Simulation */}
                                    <div style={{ flex: 1, background: 'linear-gradient(45deg, #222, #333)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Camera size={48} color="rgba(255,255,255,0.2)" />
                                        {/* Scan Frame */}
                                        <div style={{ position: 'absolute', width: '200px', height: '200px', border: '2px solid var(--color-accent)', borderRadius: '20px' }}>
                                            <div style={{ position: 'absolute', top: '50%', width: '100%', height: '2px', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)', animation: 'scan 2s infinite linear' }}></div>
                                        </div>
                                        {/* Tag */}
                                        <div style={{ position: 'absolute', bottom: '80px', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', backdropFilter: 'blur(10px)', fontSize: '0.8rem' }}>
                                            Searching for barcode...
                                        </div>
                                    </div>

                                    {/* App Bottom Nav */}
                                    <div style={{ height: '80px', background: 'black', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '10px' }}>
                                        <div style={{ opacity: 0.5 }}><Briefcase size={24} /></div>
                                        <div style={{ background: 'var(--color-accent)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-30px', border: '4px solid black' }}>
                                            <Scan size={24} color="black" />
                                        </div>
                                        <div style={{ opacity: 0.5 }}><ShoppingBag size={24} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- SECTION 2: CORE FEATURES --- */}
            <section id="technology" style={{ minHeight: '100vh', background: 'var(--color-light)', color: 'black', padding: '120px 40px' }}>
                <div className="page-container">
                    <div className="scroll-section" style={{ marginBottom: '80px' }}>
                        <div className="label-text" style={{ color: 'black', marginBottom: '10px' }}>Intelligent Infrastructure</div>
                        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.02em' }}>
                            CHECKOUT<br />REDEFINED.
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2px', background: '#ccc', border: '2px solid #ccc' }}>
                        <GridFeature
                            icon={<Smartphone size={40} />}
                            title="Scan & Go Technology"
                            desc="Use your phone camera to scan items instantly. No app installation needed—just visit the site and shop."
                        />
                        <GridFeature
                            icon={<Percent size={40} />}
                            title="Smart AI Offers"
                            desc='Our intelligent system suggests discounts in real-time (e.g., "Buy Bread, Get Butter 10% Off") based on what’s in your cart.'
                        />
                        <GridFeature
                            icon={<DoorOpen size={40} />}
                            title="Frictionless Exit"
                            desc="Generate a secure Digital Receipt QR. A quick scan by the guard, and you’re free to go."
                        />
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: MISSION --- */}
            <section id="mission" style={{ minHeight: '80vh', padding: '120px 40px', display: 'flex', alignItems: 'center' }}>
                <div className="page-container">
                    <div className="scroll-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <div className="label-text" style={{ color: 'var(--color-accent)', marginBottom: '20px' }}>Our Mission</div>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '40px' }}>
                                "We believe checkout shouldn't be a process; it should be a pause."
                            </h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#aaa', marginBottom: '40px' }}>
                                To eliminate the single biggest pain point of modern retail—waiting in line.
                                <span style={{ color: 'white', fontWeight: 'bold' }}> Zup</span> empowers shoppers to reclaim their time while giving local marts the technology to compete with global giants.
                            </p>
                            <button onClick={() => navigate('/manifesto')} className="btn-outline" style={{ padding: '16px 32px' }}>Read Manifesto</button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '100%', height: '500px', background: 'url(https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1000)', backgroundSize: 'cover', borderRadius: '30px', filter: 'grayscale(100%) contrast(120%)' }}></div>
                            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', background: 'var(--color-accent)', padding: '40px', borderRadius: '30px', color: 'black' }}>
                                <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1' }}>0s</div>
                                <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Wait Time</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* --- SECTION 4: FOOTER --- */}
            <section style={{ background: '#0a0a0a', padding: '120px 40px', borderTop: '1px solid #222' }}>
                <div className="page-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '80px' }}>
                        <div>
                            <h2 className="scroll-section" style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, marginBottom: '40px' }}>
                                READY TO<br />
                                <span style={{ color: 'var(--color-accent)' }}>SPEED UP?</span>
                            </h2>
                            <button onClick={() => navigate('/signup')} className="btn" style={{ padding: '20px 40px', fontSize: '1rem' }}>Get Started</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            <div>
                                <div className="label-text" style={{ marginBottom: '20px', color: '#666' }}>Sitemap</div>
                                <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.1rem', color: '#888' }}>
                                    <li onClick={() => scrollToSection('home')} style={{ cursor: 'pointer', transition: '0.3s' }} className="hover-text">Home</li>
                                    <li onClick={() => scrollToSection('mission')} style={{ cursor: 'pointer', transition: '0.3s' }} className="hover-text">Mission</li>
                                    <li onClick={() => scrollToSection('technology')} style={{ cursor: 'pointer', transition: '0.3s' }} className="hover-text">Technology</li>
                                    <li onClick={() => navigate('/login')} style={{ cursor: 'pointer', transition: '0.3s' }} className="hover-text">Login</li>
                                </ul>
                            </div>
                            <div>
                                <div className="label-text" style={{ marginBottom: '20px', color: '#666' }}>Legal</div>
                                <ul style={{ listStyle: 'none', lineHeight: '2.5', fontSize: '1.1rem', color: '#888' }}>
                                    <li onClick={() => navigate('/legal/privacy')} style={{ cursor: 'pointer', transition: '0.3s' }} className="hover-text">Privacy Policy</li>
                                    <li onClick={() => navigate('/legal/terms')} style={{ cursor: 'pointer', transition: '0.3s' }} className="hover-text">Terms of Service</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '150px', fontSize: '12rem', fontWeight: '800', lineHeight: 0.8, color: '#151515', userSelect: 'none', wordBreak: 'break-all' }}>ZUP.</div>
                </div>
            </section>
            <style>{`
                .hover-text:hover { color: var(--color-accent) !important; padding-left: 10px; }
            `}</style>
        </div>
    );
};

const GridFeature = ({ icon, title, desc }) => (
    <div className="scroll-section" style={{ background: 'white', padding: '60px 40px', transition: '0.3s' }}>
        <div style={{ marginBottom: '40px', color: 'black' }}>{icon}</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>{desc}</p>
    </div>
);

export default LandingPage;
