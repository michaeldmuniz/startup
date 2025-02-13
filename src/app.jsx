import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Shop } from './shop/shop';
import { Login } from './login/login';
import { Sell } from './sell-item/sell-item';


export default function App() {
    return (
        <BrowserRouter>
            <div className="body">    
                <nav>
                    <NavLink to="sell-item" className="nav-button">
                        Sell an item
                    </NavLink>
                    <NavLink to="shop" className="nav-button">
                        Go to Shop
                    </NavLink>
                    <NavLink to="login" className="nav-button">
                        Sign In
                    </NavLink>
                </nav>
            </div>
            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/login' element={<Login />} />
                <Route path='/sell-item' element={<Sell />} />
                <Route path='/shop' element={<Shop />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>

        
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }