import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const ForgotPasswordPage = ({ onGoToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong.');
            }
            
            setMessage(data.message);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fastbudget-auth-container">
            <div className="fastbudget-card">
                <div className="fastbudget-card-header">
                    <div className="wallet-logo" aria-hidden>
                        <div className="wallet-body" />
                        <div className="wallet-strap" />
                    </div>
                    <div className="app-title">
                        <h1>Password Reset</h1>
                    </div>
                </div>

                <div className="section-title">Forgot Password</div>
                <div className="cta-subtext">Enter your email to receive a reset link.</div>

                {message && <div className="api-success" style={{ color: '#16a34a', background: '#dcfce7', padding: '0.75rem', borderRadius: '0.375rem', marginTop: '1rem', textAlign: 'center' }}>{message}</div>}
                {error && <div className="api-error" style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '0.375rem', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}

                <form className="fastbudget-form" onSubmit={handleSubmit}>
                    <label className="form-label">Email</label>
                    <div className="fastbudget-input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="fastbudget-submit-btn" disabled={isLoading}>
                        {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                    </button>
                </form>
                 <a href="#" className="forgot-password" onClick={(e) => {e.preventDefault(); onGoToLogin && onGoToLogin()}}>Back to Sign In</a>

            </div>
        </div>
    );
};

export default ForgotPasswordPage;
