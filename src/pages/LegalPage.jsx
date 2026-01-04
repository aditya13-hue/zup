import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalPage = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const isPrivacy = type === 'privacy';
    const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
    const date = 'Effective Date: January 1, 2026';

    return (
        <div style={{ background: 'var(--color-bg)', color: 'white', minHeight: '100vh', padding: '40px' }}>
            <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>

                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'transparent', border: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', cursor: 'pointer', fontSize: '1rem' }}
                >
                    <ArrowLeft size={20} /> Back to Zup
                </button>

                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px', color: 'var(--color-accent)' }}>{title}</h1>
                <p style={{ color: '#666', marginBottom: '60px' }}>{date}</p>

                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#ccc' }}>
                    <p style={{ marginBottom: '20px' }}>
                        Welcome to Zup. This document outlines {isPrivacy ? 'how we handle your personal data' : 'the rules and regulations for using our Scan & Pay services'}.
                    </p>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '20px' }}>1. {isPrivacy ? 'Data Collection' : 'Acceptance of Terms'}</h3>
                    <p style={{ marginBottom: '20px' }}>
                        {isPrivacy
                            ? 'We collect minimal data necessary to process your transactions, including scanned item logs and payment tokens. We do not sell your data to third parties.'
                            : 'By accessing or using the Zup platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.'}
                    </p>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '20px' }}>2. {isPrivacy ? 'Security Infrastructure' : 'User Responsibilities'}</h3>
                    <p style={{ marginBottom: '20px' }}>
                        {isPrivacy
                            ? 'Your data is protected by AES-256 encryption. Our decentralized ledger ensures that transaction history is immutable and secure.'
                            : 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.'}
                    </p>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginTop: '40px', marginBottom: '20px' }}>3. {isPrivacy ? 'User Rights' : 'Limitation of Liability'}</h3>
                    <p style={{ marginBottom: '20px' }}>
                        {isPrivacy
                            ? 'You have the right to request a full copy of your data or to request deletion of your account at any time via the app settings.'
                            : 'Zup Technologies shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.'}
                    </p>

                    <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #333', color: '#666' }}>
                        For any legal inquiries, please contact legal@zup.tech
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LegalPage;
