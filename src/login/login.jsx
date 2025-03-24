import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function loginUser(event) {
        event.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('loggedInUser', user.username);
                setUser(user.username);
                navigate('/shop');
            } else {
                const error = await response.json();
                alert(error.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login. Please try again.');
        }
    }

    return (
        <main className="form-container">
            <h1 className="form-header">Sign In</h1>
            <form className="form-form" onSubmit={loginUser}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        id="email" 
                        placeholder="Enter your email" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        id="password" 
                        placeholder="Enter your password" 
                        required 
                    />
                </div>
                <div className="submit-button">
                    <button type="submit">Sign In</button>
                </div>
            </form>
            <section className="form-info">
                <p>Don't have an account? <NavLink to="/register">Register here</NavLink>.</p>
            </section>
        </main>
    );
}
