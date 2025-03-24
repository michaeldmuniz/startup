import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function registerUser(event) {
        event.preventDefault();

        try {
            const response = await fetch('/api/auth/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert('Registration successful! Please log in.');
                navigate('/login');
            } else {
                const error = await response.json();
                alert(error.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Failed to register. Please try again.');
        }
    }

    return (
        <main className="form-container">
            <h1 className="form-header">Register</h1>
            <form className="form-form" onSubmit={registerUser}>
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
                    <button type="submit">Register</button>
                </div>
            </form>
        </main>
    );
}
