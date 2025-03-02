import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Sell() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem('loggedInUser'));

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to sell items.');
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <main className="form-container">  
            <h1 className="form-header">Sell Your Item</h1>
            <form className="form-form">
                <div className="form-group">
                    <label htmlFor="item-name">Item Name:</label>
                    <input type="text" id="item-name" placeholder="Enter item name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="item-price">Price:</label>
                    <input type="number" id="item-price" placeholder="Enter item price" required />
                </div>
                <div className="form-group">
                    <label htmlFor="item-description">Description:</label>
                    <textarea id="item-description" placeholder="Describe the item" required></textarea>
                </div>
                <div className="form-group file-input-group">
                    <label htmlFor="item-image">Item Image:</label>
                    <input type="file" id="item-image" />
                </div>
                <div className="submit-button">
                    <button type="submit">Submit Item</button>
                </div>
            </form>
        </main>
    );
}
