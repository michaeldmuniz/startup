import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function registerUser(event) {
        event.preventDefault();

        // Get existing users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            alert('Username already exists. Please choose a different one.');
            return;
        }

        // Store new user
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please log in.');
        navigate('/login');
    }

    return (
        <main className="form-container">
            <h1 className="form-header">Register</h1>
            <form className="form-form" onSubmit={registerUser}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Enter your username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" required />
                </div>
                <div className="submit-button">
                    <button type="submit">Register</button>
                </div>
            </form>
        </main>
    );
}
