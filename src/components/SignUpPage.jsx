import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

const SignUpPage = ({ onSignUp, onGoToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Debug logging
    console.log('SignUpPage rendered');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!name) newErrors.name = 'This field is required';
        if (!email) newErrors.email = 'This field is required';
        if (!password) newErrors.password = 'This field is required';
        if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            setErrors({});
            try {
                const response = await fetch('http://localhost:4000/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Something went wrong');
                }
                
                localStorage.setItem('authToken', data.token);

                // Handle successful signup
                onSignUp(data.user);

            } catch (error) {
                setErrors({ api: error.message });
            } finally {
                setIsLoading(false);
            }
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
                        <h1>Personal Expense</h1>
                        <h1>Tracker</h1>
                    </div>
                </div>

                <div className="section-title">Sign Up</div>
                <div className="cta-subtext">Already have an account? <a href="#" onClick={(e)=>{e.preventDefault(); onGoToLogin && onGoToLogin();}}>Sign In</a></div>

                {errors.api && <div className="api-error" style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '0.375rem', marginTop: '1rem', textAlign: 'center' }}>{errors.api}</div>}

                <form className="fastbudget-form" onSubmit={handleSubmit}>
                    <label className="form-label">Full Name</label>
                    <div className="fastbudget-input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={errors.name ? 'error' : ''}
                            autoComplete="name"
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <label className="form-label">Email</label>
                    <div className="fastbudget-input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? 'error' : ''}
                            autoComplete="email"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <label className="form-label">Password</label>
                    <div className="fastbudget-input-group">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'error' : ''}
                            autoComplete="new-password"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="fastbudget-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'CREATING ACCOUNT…' : 'SIGN UP'}
                    </button>
                </form>

                <div className="powered-by">Powered by SuperTokens</div>
            </div>
        </div>
    );
};

export default SignUpPage;

