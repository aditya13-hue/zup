import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerificationPage = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null); // null, success, error
    const [data, setData] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Delay initialization
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "verify-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }, 100);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    const onScanSuccess = (decodedText) => {
        try {
            const parsed = JSON.parse(decodedText);
            if (parsed.status === 'PAID' && parsed.id) {
                setData(parsed);
                setScanResult('success');
                if (scannerRef.current) {
                    scannerRef.current.clear();
                }
            } else {
                setScanResult('error');
            }
        } catch (e) {
            setScanResult('error');
        }
    };

    const onScanFailure = (error) => {
        // console.warn(error);
    };

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Staff Verification</h1>

            {scanResult === 'success' ? (
                <div className="glass animate-fade-in" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', borderColor: '#22c55e', borderWidth: '2px' }}>
                    <CheckCircle size={64} style={{ color: '#22c55e', margin: '0 auto 1rem auto' }} />
                    <h2 style={{ fontSize: '2rem', color: '#22c55e', marginBottom: '1rem' }}>Payment Verified</h2>
                    <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}><strong>Order ID:</strong> {data.id}</p>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}><strong>Amount:</strong> ₹{data.total.toFixed(2)}</p>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}><strong>Items:</strong> {data.items}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>{new Date(data.date).toLocaleString()}</p>
                    </div>
                    <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
                        Scan Next
                    </button>
                </div>
            ) : scanResult === 'error' ? (
                <div className="glass animate-fade-in" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', borderColor: '#ef4444', borderWidth: '2px' }}>
                    <XCircle size={64} style={{ color: '#ef4444', margin: '0 auto 1rem auto' }} />
                    <h2 style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '1rem' }}>Invalid QR Code</h2>
                    <p>The scanned code is not a valid Zupp receipt.</p>
                    <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '20px', borderRadius: '24px' }}>
                    <div id="verify-reader"></div>
                    <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-dim)' }}>Scan customer's bill QR code</p>
                </div>
            )}
        </div>
    );
};

export default VerificationPage;
