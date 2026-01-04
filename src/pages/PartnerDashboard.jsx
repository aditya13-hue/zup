import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Box,
    QrCode,
    TrendingUp,
    Settings,
    LogOut,
    Search,
    Plus,
    Trash2,
    CheckCircle,
    XCircle,
    Camera
} from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import Logo from '../components/Logo';

const PartnerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [inventory, setInventory] = useState([]);
    const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalOrders: 0, recentTransactions: [] });
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    // Load Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const invRes = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/inventory`);
            const invData = await invRes.json();
            setInventory(invData);

            const anaRes = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/analytics`);
            const anaData = await anaRes.json();
            setAnalytics(anaData);
        } catch (err) {
            console.error("Error loading partner data", err);
        }
    };

    // --- VERIFICATION SCANNER ---
    useEffect(() => {
        let scanner = null;
        if (activeTab === 'verify' && isVerifying) {
            scanner = new Html5Qrcode("verify-reader");
            scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    handleVerification(decodedText);
                    scanner.stop();
                    setIsVerifying(false);
                },
                (errorMessage) => { }
            );
        }
        return () => {
            if (scanner) scanner.stop().catch(e => console.error(e));
        };
    }, [activeTab, isVerifying]);

    const handleVerification = async (receiptId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/partner/verify-receipt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiptId })
            });
            const data = await res.json();
            setVerificationResult(data);
        } catch (err) {
            setVerificationResult({ verified: false, message: "Connection Error" });
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: 'white' }}>

            {/* Sidebar */}
            <aside style={{ width: '280px', background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
                    <Logo size={28} color="var(--color-accent)" />
                    <span style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>PARTNER</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={<Box size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                    <SidebarItem icon={<QrCode size={20} />} label="Verify Exit" active={activeTab === 'verify'} onClick={() => setActiveTab('verify')} />
                    <SidebarItem icon={<TrendingUp size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                    <div style={{ marginTop: 'auto' }}>
                        <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => navigate('/login')} />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '50px', overflowY: 'auto' }}>

                {activeTab === 'overview' && (
                    <div className="animate-reveal">
                        <header style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Welcome back, Mart Team</h1>
                            <p style={{ color: '#666' }}>Here is what is happening at your store today.</p>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '50px' }}>
                            <StatCard label="Total Revenue" value={`₹${analytics.totalRevenue}`} trend="+12.5%" />
                            <StatCard label="Total Orders" value={analytics.totalOrders} trend="+4" />
                            <StatCard label="Avg. Order" value={`₹${(analytics.totalRevenue / (analytics.totalOrders || 1)).toFixed(0)}`} />
                        </div>

                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Recent Sales</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {analytics.recentTransactions.map(tx => (
                                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #222' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{tx.id}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#555' }}>{tx.items} items • {new Date(tx.date).toLocaleTimeString()}</div>
                                        </div>
                                        <div style={{ fontWeight: '900', color: 'var(--color-accent)' }}>₹{tx.total}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="animate-reveal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Inventory</h2>
                            <button className="btn" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus size={18} /> Add Product
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {inventory.map(item => (
                                <div key={item.barcode} className="glass" style={{ padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ fontSize: '2rem', background: '#000', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.image}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#555' }}>{item.barcode}</div>
                                        <div style={{ fontWeight: '900', color: 'var(--color-accent)', marginTop: '4px' }}>₹{item.price}</div>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'verify' && (
                    <div className="animate-reveal" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>Guard Verification</h2>
                        <p style={{ color: '#666', marginBottom: '40px' }}>Scan the customer's digital receipt to confirm payment.</p>

                        {!isVerifying ? (
                            <div className="glass" style={{ padding: '50px', borderRadius: '30px' }}>
                                {verificationResult ? (
                                    <div style={{ marginBottom: '30px' }}>
                                        {verificationResult.verified ? (
                                            <div style={{ color: 'var(--color-accent)' }}>
                                                <CheckCircle size={80} style={{ marginBottom: '20px' }} />
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>ACCESS GRANTED</h3>
                                            </div>
                                        ) : (
                                            <div style={{ color: '#ff4444' }}>
                                                <XCircle size={80} style={{ marginBottom: '20px' }} />
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>ACCESS DENIED</h3>
                                            </div>
                                        )}
                                        <p style={{ marginTop: '10px' }}>{verificationResult.message}</p>
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '40px' }}>
                                        <Camera size={64} color="#333" />
                                    </div>
                                )}
                                <button onClick={() => { setIsVerifying(true); setVerificationResult(null); }} className="btn" style={{ width: '100%', padding: '20px', borderRadius: '50px', fontWeight: '900' }}>
                                    OPEN CAMERA
                                </button>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', borderRadius: '30px', overflow: 'hidden', background: '#000', height: '400px' }}>
                                <div id="verify-reader" style={{ width: '100%', height: '100%' }}></div>
                                <button onClick={() => setIsVerifying(false)} style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '10px 20px', borderRadius: '50px', color: 'white', backdropFilter: 'blur(10px)' }}>
                                    CANCEL
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-reveal">
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '40px' }}>Store Settings</h2>
                        <div className="glass" style={{ padding: '40px', borderRadius: '30px', maxWidth: '600px' }}>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Razorpay Account ID</label>
                                <input type="text" defaultValue="acc_MOCK_MUMBAI" style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: 'white' }} />
                                <p style={{ fontSize: '0.8rem', color: '#444', marginTop: '10px' }}>This ID is used to route payments directly to your bank account.</p>
                            </div>
                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Platform Commission</label>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>5.0%</div>
                            </div>
                            <button className="btn" style={{ width: '100%', padding: '15px', borderRadius: '12px' }}>Save Configuration</button>
                        </div>
                    </div>
                )}

            </main>

            <style>{`
                .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
                #verify-reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
            `}</style>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            background: active ? 'rgba(204,255,0,0.1)' : 'transparent',
            color: active ? 'var(--color-accent)' : '#888',
            fontWeight: active ? 'bold' : 'normal',
            transition: '0.2s'
        }}
    >
        {icon}
        <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
);

const StatCard = ({ label, value, trend }) => (
    <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
        <div style={{ color: '#555', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>{label}</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: trend ? '8px' : '0' }}>{value}</div>
        {trend && <div style={{ color: trend.startsWith('+') ? 'var(--color-accent)' : '#ff4444', fontSize: '0.85rem', fontWeight: 'bold' }}>{trend} <span style={{ color: '#444', fontWeight: 'normal' }}>vs last month</span></div>}
    </div>
);

export default PartnerDashboard;
