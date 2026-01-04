// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
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
    MapPin
} from 'lucide-react';
import { useGeolocation, calculateDistance } from '../hooks/useGeolocation';
const ScannerPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'cart'
    const [isScanning, setIsScanning] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [lastScanned, setLastScanned] = useState(null);
    const [aiOffers, setAiOffers] = useState([]);
    const scannerRef = useRef(null);

    // Load/Save Cart
    useEffect(() => {
        const savedCart = localStorage.getItem('zup_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('zup_cart', JSON.stringify(cart));
    }, [cart]);

    // Fetch Products from Backend
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => {
                console.error("Failed to fetch products", err);
            });
    }, []);

    // Location & Stores
    const { location, error: locationError, loading: locationLoading } = useGeolocation();
    const [stores, setStores] = useState([]);
    const [nearestStore, setNearestStore] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/stores`)
            .then(res => res.json())
            .then(data => setStores(data))
            .catch(err => console.error("Failed to fetch stores", err));
    }, []);

    // Find nearest store when location changes
    useEffect(() => {
        if (location && stores.length > 0) {
            let nearest = null;
            let minDistance = Infinity;

            stores.forEach(store => {
                const distance = calculateDistance(
                    location.lat,
                    location.lng,
                    store.lat,
                    store.lng
                );
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

        const timeout = setTimeout(fetchOffers, 1000); // Debounce
        return () => clearTimeout(timeout);
    }, [cart, nearestStore]);

    // Scanner Logic
    useEffect(() => {
        // If scanning is active, init scanner
        if (isScanning && permissionGranted && !scannerRef.current) {
            // Slight delay to ensure DOM is ready
            setTimeout(() => {
                const scanner = new Html5QrcodeScanner("reader", {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                }, false);

                scanner.render(onScanSuccess, (err) => { });
                scannerRef.current = scanner;
            }, 100);
        }

        // Cleanup when stop scanning
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error(err));
                scannerRef.current = null;
            }
        };
    }, [isScanning, permissionGranted]);

    const onScanSuccess = (decodedText) => {
        const product = products.find(p => p.barcode === decodedText);
        if (product) {
            addToCart(product);
            setLastScanned(product);
            setIsScanning(false); // Close scanner on success
            // Optional: Vibrate phone
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

    // --- RENDER VIEWS ---

    // 1. Permission Gate
    if (!permissionGranted) {
        return (
            <div style={{ height: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--color-accent)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', boxShadow: '0 0 40px rgba(204,255,0,0.3)' }}>
                    <Camera size={40} color="black" />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '20px' }}>ENABLE CAMERA</h1>
                <p style={{ color: '#888', marginBottom: '40px' }}>To scan products, Zup needs access to your camera.</p>
                <button onClick={() => setPermissionGranted(true)} className="btn" style={{ padding: '20px 40px', width: '100%' }}>Allow Access</button>
            </div>
        );
    }

    // 2. Main App Interface
    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white', fontFamily: 'var(--font-main)', paddingBottom: '100px' }}>

            {/* --- HEADER --- */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', background: 'var(--color-accent)', borderRadius: '50%' }}></div>
                    ZUP.
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>AD</span>
                </div>
            </div>

            {/* --- HOME TAB --- */}
            {activeTab === 'home' && (
                <div className="animate-reveal" style={{ padding: '0 20px' }}>

                    {/* Location Status Card */}
                    {locationLoading ? (
                        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px', marginBottom: '20px', textAlign: 'center', color: '#888' }}>
                            <MapPin size={24} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                            <p>Getting your location...</p>
                        </div>
                    ) : locationError ? (
                        <div style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px', marginBottom: '20px', border: '1px solid #ff4444' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4444', marginBottom: '10px' }}>
                                <MapPin size={20} />
                                <span style={{ fontWeight: 'bold' }}>Location Required</span>
                            </div>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Please enable location to find nearby stores</p>
                        </div>
                    ) : nearestStore ? (
                        <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', borderRadius: '20px', padding: '20px', marginBottom: '20px', border: nearestStore.distance < 500 ? '1px solid var(--color-accent)' : '1px solid #333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <MapPin size={20} color={nearestStore.distance < 500 ? 'var(--color-accent)' : '#888'} />
                                <span style={{ fontWeight: 'bold', color: nearestStore.distance < 500 ? 'var(--color-accent)' : 'white' }}>
                                    {nearestStore.distance < 500 ? '✓ IN RANGE' : 'NEARBY'}
                                </span>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>{nearestStore.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#888' }}>{nearestStore.address}</div>
                            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '10px' }}>
                                {(nearestStore.distance / 1000).toFixed(2)} km away
                            </div>
                        </div>
                    ) : null}

                    {/* Status Card */}
                    <div style={{ background: 'linear-gradient(135deg, #222 0%, #111 100%)', borderRadius: '30px', padding: '30px', marginBottom: '30px', border: '1px solid #333', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}>
                        <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Session</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1', marginBottom: '10px', color: 'var(--color-accent)' }}>
                            ₹{total.toFixed(2)}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#ccc' }}>
                            <span>{totalItems} items in cart</span>
                        </div>
                    </div>

                    {/* Quick Notification */}
                    {lastScanned && (
                        <div style={{ background: 'rgba(204, 255, 0, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '16px', padding: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'var(--color-accent)', padding: '10px', borderRadius: '10px' }}>
                                <Zap size={20} color="black" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>JUST ADDED</div>
                                <div style={{ fontWeight: '600' }}>{lastScanned.name}</div>
                            </div>
                        </div>
                    )}

                    {/* Offers Carousel */}
                    {aiOffers.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Exclusive For You</h3>
                                <div style={{ background: 'var(--color-accent)', color: 'black', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>AI POWERED</div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {aiOffers.map((offer, i) => (
                                    <div key={offer.id || i} style={{ minWidth: '240px', minHeight: '140px', background: '#1a1a1a', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #333' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ background: 'rgba(204,255,0,0.1)', padding: '8px', borderRadius: '12px' }}>
                                                    <Zap size={16} color="var(--color-accent)" />
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#666' }}>{offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}</div>
                                            </div>
                                            <div style={{ fontWeight: 'bold', marginTop: '12px', fontSize: '1rem' }}>{offer.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{offer.description}</div>
                                        </div>
                                        {offer.rewardItem && (
                                            <button
                                                onClick={() => {
                                                    const product = products.find(p => p.name === offer.rewardItem);
                                                    if (product) addToCart(product);
                                                }}
                                                className="btn-outline"
                                                style={{ padding: '8px 12px', fontSize: '0.75rem', borderRadius: '12px', marginTop: '12px', width: 'fit-content' }}
                                            >
                                                Add {offer.rewardItem}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* --- CART TAB --- */}
            {activeTab === 'cart' && (
                <div className="animate-reveal" style={{ padding: '0 20px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '30px' }}>YOUR CART</h2>

                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
                            <ShoppingCart size={40} style={{ margin: '0 auto 20px auto', opacity: 0.5 }} />
                            <p>Cart is empty</p>
                            <button onClick={() => { setActiveTab('home'); setIsScanning(true); }} className="btn-outline" style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '50px' }}>Scan Items</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {cart.map(item => (
                                <div key={item.barcode} style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ fontSize: '2rem' }}>{item.image}</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)' }}>₹{item.price}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#000', padding: '5px 10px', borderRadius: '50px' }}>
                                        <button onClick={() => item.qty > 1 ? updateQty(item.barcode, -1) : removeItem(item.barcode)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                            {item.qty === 1 ? <Trash2 size={16} color="#ff4444" /> : <Minus size={16} />}
                                        </button>
                                        <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.barcode, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div style={{ height: '40px' }}></div>

                            <button onClick={() => navigate('/checkout')} className="btn" style={{ width: '100%', padding: '20px', borderRadius: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>CHECKOUT</span>
                                <span>₹{total.toFixed(2)}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}


            {/* --- BOTTOM NAVIGATION --- */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #222', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>

                {/* Home */}
                <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? 'var(--color-accent)' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <Home size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>HOME</span>
                </button>

                {/* SCAN BUTTON (FAB) */}
                <button
                    onClick={() => setIsScanning(true)}
                    style={{
                        width: '70px',
                        height: '70px',
                        background: 'var(--color-accent)',
                        borderRadius: '50%',
                        border: '5px solid black',
                        marginTop: '-50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(204,255,0,0.4)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        position: 'relative',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ScanLine size={30} color="black" />
                    {/* Ripple/Pulse effect */}
                    <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid var(--color-accent)', opacity: 0.5, animation: 'pulse 2s infinite' }}></div>
                </button>
                <style>{`@keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }`}</style>

                {/* Cart */}
                <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: activeTab === 'cart' ? 'var(--color-accent)' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', position: 'relative' }}>
                    <ShoppingCart size={24} />
                    {cart.length > 0 && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'white', color: 'black', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</div>}
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>CART</span>
                </button>

            </div>

            {/* --- SCANNER OVERLAY --- */}
            {isScanning && (
                <div className="animate-reveal" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'black', display: 'flex', flexDirection: 'column' }}>

                    {/* Header */}
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%', animation: 'blink 1s infinite' }}></div> LIVE
                        </div>
                        <button onClick={() => setIsScanning(false)} style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Camera */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <div id="reader" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></div>
                        {/* Custom Reticle */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '280px', height: '280px', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '40px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '40px', height: '40px', borderTop: '4px solid var(--color-accent)', borderLeft: '4px solid var(--color-accent)', borderRadius: '6px 0 0 0' }}></div>
                                <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '40px', height: '40px', borderTop: '4px solid var(--color-accent)', borderRight: '4px solid var(--color-accent)', borderRadius: '0 6px 0 0' }}></div>
                                <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '40px', height: '40px', borderBottom: '4px solid var(--color-accent)', borderLeft: '4px solid var(--color-accent)', borderRadius: '0 0 0 6px' }}></div>
                                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '40px', height: '40px', borderBottom: '4px solid var(--color-accent)', borderRight: '4px solid var(--color-accent)', borderRadius: '0 0 6px 0' }}></div>
                                <div style={{ position: 'absolute', top: '50%', width: '100%', height: '2px', background: 'red', opacity: 0.6, boxShadow: '0 0 10px red' }}></div>
                            </div>
                        </div>
                        <div style={{ position: 'absolute', bottom: '100px', width: '100%', textAlign: 'center', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            Align code within frame
                        </div>
                    </div>

                    <style>{`@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
                </div>
            )}

        </div>
    );
};

export default ScannerPage;
