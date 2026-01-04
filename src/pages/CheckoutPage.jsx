import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft, Download } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, completed
    const [billData, setBillData] = useState(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('zup_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setPaymentStatus('processing');

        try {
            // Create order on backend
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    storeId: 'acc_MOCK_MUMBAI' // In real app, get from selected store
                })
            });

            const order = await response.json();

            // Razorpay Checkout options
            const options = {
                key: order.key_id,
                amount: order.amount,
                currency: order.currency,
                name: 'Zup',
                description: 'Scan & Go Checkout',
                order_id: order.id,
                handler: async function (response) {
                    // Verify payment on backend
                    const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.verified) {
                        const receipt = {
                            id: `ZUP-${response.razorpay_payment_id.slice(-6)}`,
                            total: total,
                            items: cart.length,
                            date: new Date().toISOString(),
                            status: 'PAID',
                            payment_id: response.razorpay_payment_id
                        };

                        setBillData(JSON.stringify(receipt));
                        setPaymentStatus('completed');
                        localStorage.removeItem('zup_cart');
                    } else {
                        setPaymentStatus('idle');
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'Zup Customer',
                    email: 'customer@zup.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#ccff00'
                },
                modal: {
                    ondismiss: function () {
                        setPaymentStatus('idle');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment error", error);
            setPaymentStatus('idle');
            alert("Connection error. Is the backend running?");
        }
    };


    if (paymentStatus === 'completed') {
        return (
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="glass animate-fade-in" style={{ padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#22c55e', marginBottom: '1rem' }}>
                        <CheckCircle size={64} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Success!</h2>
                    <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem' }}>Please show this QR code at the exit.</p>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '2rem' }}>
                        {billData && <QRCodeSVG value={billData} size={200} />}
                    </div>

                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '2rem' }}>Order #{JSON.parse(billData).id.split('-')[1]}</p>

                    <button className="btn btn-outline" onClick={() => navigate('/app')}>
                        <ArrowLeft size={18} /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '16px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Checkout</h2>
            </header>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Order Summary */}
                <div className="glass" style={{ padding: '24px', borderRadius: '24px', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item.barcode} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <div>
                                <p style={{ fontWeight: '500' }}>{item.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>Qty: {item.qty}</p>
                            </div>
                            <p>₹{(item.price * item.qty).toFixed(2)}</p>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--color-primary)' }}>₹{total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Payment Method</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--color-primary)' }}>
                                <CreditCard size={24} style={{ marginRight: '12px', color: 'var(--color-primary)' }} />
                                <span style={{ flex: 1 }}>Credit Card (**** 4242)</span>
                                <input type="radio" name="payment" defaultChecked />
                            </label>

                            <label className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '12px', cursor: 'pointer', opacity: 0.6 }}>
                                <span style={{ marginRight: '12px', fontSize: '1.5rem' }}></span>
                                <span style={{ flex: 1 }}>Apple Pay</span>
                                <input type="radio" name="payment" disabled />
                            </label>
                        </div>
                    </div>

                    <button
                        className="btn"
                        style={{ width: '100%', padding: '20px', fontSize: '1.2rem', justifyContent: 'center' }}
                        onClick={handlePayment}
                        disabled={paymentStatus === 'processing' || cart.length === 0}
                    >
                        {paymentStatus === 'processing' ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
