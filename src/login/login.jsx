import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function loginUser(event) {
        event.preventDefault();

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', username);
            setUser(username);
            navigate('/shop');
        } else {
            alert('Invalid username or password.');
        }
    }

    return (
        <main className="form-container">
            <h1 className="form-header">Sign In</h1>
            <form className="form-form" onSubmit={loginUser}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Enter your username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" required />
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
