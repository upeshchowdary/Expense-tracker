import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';


const Login = ({ onLogin, onGoToSignUp }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        setErrors({}); // Clear previous API errors
        
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed. Please check your credentials.');
            }

             localStorage.setItem('authToken', data.token);
            
            // On successful login, call onLogin with user data from the server
            onLogin(data.user);

        } catch (error) {
            console.error('Login error:', error);
            setErrors({ api: error.message });
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
                        <h1>Personal Expense</h1>
                        <h1>Tracker</h1>
                    </div>
                </div>

                <div className="section-title">Sign In</div>
                <div className="cta-subtext">Not registered yet? <a href="#" onClick={(e)=>{e.preventDefault(); onGoToSignUp && onGoToSignUp();}}>Sign Up</a></div>

                {errors.api && <div className="api-error" style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '0.375rem', marginTop: '1rem', textAlign: 'center' }}>{errors.api}</div>}

                <form className="fastbudget-form" onSubmit={handleSubmit}>
                    <label className="form-label">Email</label>
                    <div className="fastbudget-input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            autoComplete="email"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <label className="form-label">Password</label>
                    <div className="fastbudget-input-group">
                        <Lock className="input-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="fastbudget-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'SIGNING IN…' : 'SIGN IN'}
                    </button>
                </form>

                <a href="#" className="forgot-password">Forgot password?</a>

                <div className="powered-by">Powered by SuperTokens</div>
            </div>
        </div>
    );
};

export default Login;
