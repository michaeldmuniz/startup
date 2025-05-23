import React, { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { webSocketClient } from './utils/websocket';

import { Shop } from './shop/shop';
import { Login } from './login/login';
import { Register } from './register/register';
import { Sell } from './sell-item/sell-item';
import { MyItems } from './my-items/my-items';

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(localStorage.getItem('loggedInUser'));
        // Initialize WebSocket connection
        webSocketClient.connect();
        
        // Cleanup WebSocket connection on component unmount
        return () => {
            webSocketClient.disconnect();
        };
    }, []);

    function logout() {
        localStorage.removeItem('loggedInUser');
        setUser(null);
    }

    return (
        <BrowserRouter>
            <header>
                {user ? (
                    <>
                        <span>Welcome, {user}</span>
                        <button className="nav-button" onClick={logout}>Sign Out</button>
                    </>
                ) : (
                    <NavLink to="/login" className="nav-button">Sign In</NavLink>
                )}
                <NavLink to="/shop" className="nav-button">Go to Shop</NavLink>
                {user && <NavLink to="/sell-item" className="nav-button">Sell an item</NavLink>}
                {user && <NavLink to="/my-items" className="nav-button">My Items</NavLink>}
            </header>
            <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/sell-item" element={<Sell />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/my-items" element={<MyItems />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <footer>
                <div className="container-fluid bg-secondary text-center">
                    <p>Michael Muniz</p>
                    <a href="https://github.com/michaeldmuniz/startup" target="_blank" rel="noopener noreferrer">
                        Github Link
                    </a>
                </div>
            </footer>
        </BrowserRouter>
    );
}

function NotFound() {
    return (
        <div className="container-fluid bg-secondary text-center">
            <h1>404: Page Not Found</h1>
            <p>Oops! The page you are looking for does not exist.</p>
        </div>
    );
}
