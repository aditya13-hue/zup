// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    ScanLine,
    X,
    Home,
    Zap,
    Camera,
    ChevronRight,
    Plus,
    Minus,
    Trash2,
    MapPin,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { useGeolocation, calculateDistance } from '../hooks/useGeolocation';
import { useAuth } from '../contexts/AuthContext';

const ScannerPage = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [cart, setCart] = useState([]);
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'cart'
    const [isScanning, setIsScanning] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [lastScanned, setLastScanned] = useState(null);
    const [aiOffers, setAiOffers] = useState([]);
    const [showStorePicker, setShowStorePicker] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [manualStore, setManualStore] = useState(null);
    const html5QrCodeRef = useRef(null);

    // Load/Save Cart
    useEffect(() => {
        const savedCart = localStorage.getItem('zupp_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('zupp_cart', JSON.stringify(cart));
    }, [cart]);

    // Fetch Products from Backend
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to fetch products", err));
    }, []);

    // Location & Stores
    const { location, error: locationError, loading: locationLoading } = useGeolocation();
    const [stores, setStores] = useState([]);
    const [storesError, setStoresError] = useState(false);
    const [nearestStore, setNearestStore] = useState(null);

    const activeStore = manualStore || nearestStore;

    const fetchStores = () => {
        setStoresError(false);
        fetch(`${import.meta.env.VITE_API_URL}/api/stores`)
            .then(res => res.json())
            .then(data => setStores(data))
            .catch(err => {
                console.error("Failed to fetch stores", err);
                setStoresError(true);
            });
    };

    useEffect(() => {
        fetchStores();
    }, []);

    // Find nearest store when location changes
    useEffect(() => {
        if (location && stores.length > 0) {
            let nearest = null;
            let minDistance = Infinity;

            stores.forEach(store => {
                const distance = calculateDistance(location.lat, location.lng, store.lat, store.lng);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = { ...store, distance };
                }
            });

            setNearestStore(nearest);
        }
    }, [location, stores]);

    // Fetch AI Recommendations
    useEffect(() => {
        if (cart.length === 0) {
            setAiOffers([]);
            return;
        }

        const fetchOffers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/recommend`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart, nearestStoreId: nearestStore?.id })
                });
                const data = await response.json();
                if (data.offers) setAiOffers(data.offers);
            } catch (err) {
                console.error("Failed to fetch AI offers", err);
            }
        };

        const timeout = setTimeout(fetchOffers, 1000);
        return () => clearTimeout(timeout);
    }, [cart, activeStore]);

    // Scanner Logic (Cleaned up for Html5Qrcode)
    useEffect(() => {
        if (isScanning && permissionGranted) {
            const startScanner = async () => {
                try {
                    const html5QrCode = new Html5Qrcode("reader");
                    html5QrCodeRef.current = html5QrCode;

                    const config = {
                        fps: 15,
                        qrbox: { width: 280, height: 280 },
                        aspectRatio: 1.0
                    };

                    await html5QrCode.start(
                        { facingMode: "environment" },
                        config,
                        onScanSuccess
                    );
                } catch (err) {
                    console.error("Scanner start error", err);
                    setIsScanning(false);
                }
            };

            setTimeout(startScanner, 300); // Give DOM a moment
        }

        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().then(() => {
                    html5QrCodeRef.current = null;
                }).catch(err => console.error("Scanner stop error", err));
            }
        };
    }, [isScanning, permissionGranted]);

    const onScanSuccess = (decodedText) => {
        const product = products.find(p => p.barcode === decodedText);
        if (product) {
            addToCart(product);
            setLastScanned(product);
            setIsScanning(false);
            if (navigator.vibrate) navigator.vibrate(200);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.barcode === product.barcode);
            if (existing) return prev.map(item => item.barcode === product.barcode ? { ...item, qty: item.qty + 1 } : item);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (barcode, delta) => {
        setCart(prev => prev.map(item => {
            if (item.barcode === barcode) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : item;
            }
            return item;
        }));
    };

    const removeItem = (barcode) => {
        setCart(prev => prev.filter(item => item.barcode !== barcode));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error("Failed to logout", err);
        }
    };

    const getInitials = () => {
        if (!currentUser?.email) return '??';
        return currentUser.email.substring(0, 2).toUpperCase();
    };

    const renderStorePicker = () => (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', flexDirection: 'column', padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>CHOOSE YOUR MART</h2>
                <button onClick={() => setShowStorePicker(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={20} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: 1 }}>
                {stores.length === 0 && !storesError && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                        <div className="spin" style={{ width: '30px', height: '30px', border: '2px solid #333', borderTopColor: 'var(--color-accent)', borderRadius: '50%', margin: '0 auto 15px' }}></div>
                        Fetching active marts...
                    </div>
                )}
                {storesError && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
                        <p>Connection lost.</p>
                        <button onClick={fetchStores} className="btn-outline" style={{ marginTop: '15px', padding: '8px 20px', fontSize: '0.8rem', borderRadius: '50px' }}>Retry Connection</button>
                    </div>
                )}
                {stores
                    .map(store => {
                        if (location) {
                            const dist = calculateDistance(location.lat, location.lng, store.lat, store.lng);
                            return { ...store, distance: dist };
                        }
                        return store;
                    })
                    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
                    .map(store => (
                        <div
                            key={store.id}
                            onClick={() => {
                                setManualStore(store);
                                setShowStorePicker(false);
                            }}
                            style={{
                                background: '#111',
                                padding: '24px',
                                borderRadius: '24px',
                                border: (manualStore?.id === store.id || (!manualStore && nearestStore?.id === store.id)) ? '1.5px solid var(--color-accent)' : '1px solid #222',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: '0.3s'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '4px' }}>{store.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{store.address}</div>
                            </div>
                            {store.distance && (
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '800' }}>
                                        {(store.distance / 1000).toFixed(1)} km
                                    </div>
                                    <div style={{ fontSize: '0.6rem', color: '#444', textTransform: 'uppercase' }}>Away</div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            <button
                onClick={() => {
                    setManualStore(null);
                    setShowStorePicker(false);
                }}
                style={{ marginTop: '20px', padding: '20px', background: 'transparent', border: '1px solid #333', borderRadius: '20px', color: '#888', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
                AUTO-DETECT NEAREST
            </button>
        </div>
    );

    // --- RENDER VIEWS ---

    // 1. Premium Permission Onboarding
    if (!permissionGranted) {
        return (
            <div style={{ height: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', padding: '40px', justifyContent: 'space-between' }}>
                <div style={{ marginTop: '40px' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--color-accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', boxShadow: '0 20px 40px rgba(204,255,0,0.2)' }}>
                        <ShieldCheck size={32} color="black" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.04em', marginBottom: '20px' }}>
                        SECURE<br />SCANNING
                    </h1>
                    <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '300px' }}>
                        To provide a seamless "Scan & Go" experience, Zupp needs access to:
                    </p>

                    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-accent)' }}><Camera size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>CAMERA</div>
                                <div style={{ fontSize: '0.8rem', color: '#555' }}>To scan barcodes instantly</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-accent)' }}><MapPin size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>LOCATION</div>
                                <div style={{ fontSize: '0.8rem', color: '#555' }}>To find the closest Mart</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => {
                            setPermissionGranted(true);
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(() => { }, () => { });
                            }
                        }}
                        className="btn"
                        style={{ padding: '24px', width: '100%', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>ALLOW & START</span>
                        <ArrowRight size={20} />
                    </button>
                    <p style={{ textAlign: 'center', color: '#444', fontSize: '0.75rem', marginTop: '20px' }}>
                        By proceeding, you agree to our Privacy Terms.
                    </p>
                </div>
            </div>
        );
    }

    // 2. Premium Discovery State
    if (permissionGranted && locationLoading && !manualStore && !nearestStore) {
        return (
            <div style={{ height: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '40px' }}>
                    <div className="spin" style={{ position: 'absolute', inset: 0, border: '4px solid #111', borderTopColor: 'var(--color-accent)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', inset: '20px', background: '#0a0a0a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={32} color="var(--color-accent)" className="animate-pulse" />
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.1em' }}>SYNCING LOCATION</h2>
                <p style={{ color: '#666', marginTop: '12px', textAlign: 'center', maxWidth: '250px', fontSize: '0.9rem' }}>
                    Matching you with the nearest Zupp partner mart...
                </p>

                <button
                    onClick={() => setShowStorePicker(true)}
                    className="btn-outline"
                    style={{ marginTop: '80px', padding: '12px 24px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                    SELECT MANUALLY
                </button>

                {showStorePicker && renderStorePicker()}
            </div>
        );
    }

    // 3. Main Interface
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'var(--font-main)', paddingBottom: '100px' }}>

            {/* --- HEADER --- */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--color-accent)', borderRadius: '50%' }}></div>
                    ZUPP.
                </div>
                <div
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    style={{ position: 'relative', width: '42px', height: '42px', borderRadius: '14px', background: 'var(--color-accent)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}
                >
                    <span style={{ fontSize: '0.85rem', fontWeight: '900' }}>{getInitials()}</span>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                        <div className="animate-fade-in" style={{ position: 'absolute', top: '55px', right: 0, background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '12px', width: '220px', zIndex: 120, boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                            <div style={{ padding: '12px', borderBottom: '1px solid #222', marginBottom: '8px' }}>
                                <div style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Member</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{currentUser?.email}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ff4444', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,68,68,0.1)'}
                                onMouseOut={(e) => e.target.style.background = 'none'}
                            >
                                <Trash2 size={16} /> SIGN OUT
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- HOME TAB --- */}
            {activeTab === 'home' && (
                <div className="animate-reveal" style={{ padding: '0 20px' }}>

                    {/* Location Card */}
                    <div
                        onClick={() => setShowStorePicker(true)}
                        style={{ background: '#111', borderRadius: '24px', padding: '20px', marginBottom: '24px', border: activeStore?.distance < 500 ? '1px solid var(--color-accent)' : '1px solid #222', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} color={activeStore?.distance < 500 ? 'var(--color-accent)' : '#555'} />
                                <span style={{ fontWeight: '800', fontSize: '0.75rem', color: activeStore?.distance < 500 ? 'var(--color-accent)' : '#555', textTransform: 'uppercase' }}>
                                    {activeStore?.distance < 500 ? '✓ IN RANGE' : 'LOCATION CONNECTED'}
                                </span>
                            </div>
                            <ChevronRight size={16} color="#444" />
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>{activeStore?.name || 'Searching...'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{activeStore?.address}</div>
                    </div>

                    {/* Session Value Card */}
                    <div style={{ background: 'linear-gradient(135deg, #181818 0%, #050505 100%)', borderRadius: '32px', padding: '32px', marginBottom: '32px', border: '1px solid #222', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)' }}>
                        <div style={{ color: '#444', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>Current Total</div>
                        <div style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', fontWeight: '900', lineHeight: '1', marginBottom: '16px', color: 'white', letterSpacing: '-0.04em' }}>
                            ₹{total.toFixed(0)}<span style={{ fontSize: '0.4em', color: '#555' }}>.{total.toFixed(2).split('.')[1]}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ background: '#1a1a1a', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #333' }}>
                                {totalItems} ITEMS
                            </div>
                        </div>
                    </div>

                    {/* Offers */}
                    {aiOffers.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: '900', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>FOR YOU</h3>
                                <div style={{ background: 'var(--color-accent)', color: 'black', fontSize: '0.6rem', padding: '3px 10px', borderRadius: '50px', fontWeight: '900' }}>AI ENGINE</div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
                                {aiOffers.map((offer, i) => (
                                    <div key={offer.id || i} style={{ minWidth: '260px', minHeight: '160px', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #222' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ background: 'rgba(204,255,0,0.1)', padding: '10px', borderRadius: '12px' }}>
                                                    <Zap size={18} color="var(--color-accent)" />
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '900', background: 'rgba(204,255,0,0.1)', padding: '4px 10px', borderRadius: '50px' }}>
                                                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: '800', marginTop: '16px', fontSize: '1.1rem' }}>{offer.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '4px', lineHeight: '1.4' }}>{offer.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- CART TAB --- */}
            {activeTab === 'cart' && (
                <div className="animate-reveal" style={{ padding: '0 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>CART</h2>
                        {cart.length > 0 && <span style={{ color: '#444', fontWeight: '800' }}>{totalItems} UNITS</span>}
                    </div>

                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
                            <div style={{ width: '80px', height: '80px', border: '2px dashed #222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <ShoppingCart size={32} opacity={0.3} />
                            </div>
                            <p style={{ fontWeight: 'bold' }}>Your cart is empty</p>
                            <button onClick={() => setIsScanning(true)} className="btn" style={{ marginTop: '30px', padding: '16px 32px', borderRadius: '50px' }}>Start Scanning</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {cart.map(item => (
                                <div key={item.barcode} style={{ background: '#0a0a0a', borderRadius: '24px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #111' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '2.5rem', background: '#111', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.image}</div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>₹{item.price}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#111', padding: '6px', borderRadius: '50px' }}>
                                        <button onClick={() => item.qty > 1 ? updateQty(item.barcode, -1) : removeItem(item.barcode)} style={{ background: '#1a1a1a', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            {item.qty === 1 ? <Trash2 size={14} color="#ff4444" /> : <Minus size={14} />}
                                        </button>
                                        <span style={{ fontWeight: '900', minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.barcode, 1)} style={{ background: '#1a1a1a', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div style={{ height: '40px' }}></div>

                            <button onClick={() => navigate('/checkout')} className="btn" style={{ width: '100%', padding: '24px', borderRadius: '24px', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 40px rgba(204,255,0,0.2)' }}>
                                <span style={{ fontWeight: '900' }}>CHECKOUT</span>
                                <span style={{ fontWeight: '900' }}>₹{total.toFixed(2)}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}


            {/* --- BOTTOM NAVIGATION --- */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(30px)', borderTop: '1px solid #111', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 50, height: '90px' }}>
                <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? 'white' : '#444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
                    <Home size={22} color={activeTab === 'home' ? 'var(--color-accent)' : '#444'} />
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.05em' }}>HOME</span>
                </button>

                <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => setIsScanning(true)}
                        style={{
                            width: '76px',
                            height: '76px',
                            background: 'var(--color-accent)',
                            borderRadius: '26px',
                            border: '6px solid black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 15px 35px rgba(204,255,0,0.4)',
                            cursor: 'pointer',
                            transform: 'translateY(-20px)',
                            transition: '0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        <ScanLine size={32} color="black" />
                    </button>
                </div>

                <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: activeTab === 'cart' ? 'white' : '#444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <ShoppingCart size={22} color={activeTab === 'cart' ? 'var(--color-accent)' : '#444'} />
                        {cart.length > 0 && <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'white', color: 'black', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</div>}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.05em' }}>CART</span>
                </button>
            </div>

            {/* --- CUSTOM SCANNER OVERLAY --- */}
            {isScanning && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'black', display: 'flex', flexDirection: 'column' }}>

                    {/* Header Controls */}
                    <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
                        <div style={{ padding: '6px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%', animation: 'blink 1s infinite' }}></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'white', letterSpacing: '0.1em' }}>SCANNING</span>
                        </div>
                        <button onClick={() => setIsScanning(false)} style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Camera Viewport */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <div id="reader" style={{ width: '100%', height: '100%' }}></div>

                        {/* Custom Reticle Overlay */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                                {/* Corners */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '4px solid var(--color-accent)', borderLeft: '4px solid var(--color-accent)', borderRadius: '12px 0 0 0' }}></div>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '4px solid var(--color-accent)', borderRight: '4px solid var(--color-accent)', borderRadius: '0 12px 0 0' }}></div>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '4px solid var(--color-accent)', borderLeft: '4px solid var(--color-accent)', borderRadius: '0 0 0 12px' }}></div>
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '4px solid var(--color-accent)', borderRight: '4px solid var(--color-accent)', borderRadius: '0 0 12px 0' }}></div>

                                {/* Animated Scan Line */}
                                <div style={{ position: 'absolute', top: '50%', width: '100%', height: '2px', background: 'var(--color-accent)', boxShadow: '0 0 15px var(--color-accent)', animation: 'scannerLine 2s infinite ease-in-out' }}></div>
                            </div>
                        </div>

                        {/* Hint Text */}
                        <div style={{ position: 'absolute', bottom: '60px', width: '100%', textAlign: 'center' }}>
                            <div style={{ display: 'inline-block', padding: '12px 24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold', color: '#888' }}>
                                ALIGN BARCODE WITHIN FRAME
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @keyframes scannerLine { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
                        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        #reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
                        #reader__dashboard { display: none !important; }
                        #reader__header { display: none !important; }
                    `}</style>
                </div>
            )}

            {/* Version Stamp */}
            <div style={{ position: 'fixed', bottom: '100px', right: '10px', fontSize: '8px', color: '#222', pointerEvents: 'none', zIndex: 10 }}>
                BUILD V2.2.0-ELITE
            </div>

            {/* Manual Store Picker (Overlay) */}
            {showStorePicker && renderStorePicker()}
        </div>
    );
};

export default ScannerPage;
