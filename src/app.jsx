import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

// Import components
import { Shop } from './shop/shop';
import { Login } from './login/login';
import { Sell } from './sell-item/sell-item';

export default function App() {
    return (
        <BrowserRouter>
            <header className="navbar fixed-top navbar-dark bg-dark">
                <NavLink to="/shop" className="nav-button">Go to Shop</NavLink>
                <NavLink to="/sell-item" className="nav-button">Sell an item</NavLink>
                <NavLink to="/login" className="nav-button">Sign In</NavLink>
            </header>
            <Routes>
                <Route path="/" element={<Shop />} exact />
                <Route path="/login" element={<Login />} />
                <Route path="/sell-item" element={<Sell />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <footer>
                <a href="https://github.com/michaeldmuniz/startup">Github Link</a>
            </footer>
        </BrowserRouter>
        
    );
}

function NotFound() {
    return <div className="container-fluid bg-secondary text-center">
        <h1>404: Page Not Found</h1>
        <p>Oops! The page you are looking for does not exist. Please use the navigation to find your way.</p>
    </div>;
}
