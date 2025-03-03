import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function MyItems() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem('loggedInUser'));
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to view your items.');
            navigate('/login');
        } else {
            // Load all items, then filter by logged-in user
            const storedItems = JSON.parse(localStorage.getItem('shopItems')) || [];
            setItems(storedItems.filter(item => item.seller === user));
        }
    }, [user, navigate]);

    function handleDelete(itemId) {
        // Remove item from localStorage
        let storedItems = JSON.parse(localStorage.getItem('shopItems')) || [];
        let updatedItems = storedItems.filter(item => item.id !== itemId);
        localStorage.setItem('shopItems', JSON.stringify(updatedItems));

        // Update state
        setItems(updatedItems.filter(item => item.seller === user));
        alert('Item successfully removed.');
    }

    return (
        <main className="app-container">
            <h1>My Listed Items</h1>
            <p>Manage the items you have posted for sale.</p>
            <div className="items-list">
                {items.length === 0 ? (
                    <p>You haven't listed any items for sale.</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="item">
                            <h2>{item.name}</h2>
                            <p><strong>Brand:</strong> {item.brand}</p>
                            {item.image && <img src={item.image} alt={item.name} />}
                            <p><strong>Price:</strong> ${item.price}</p>
                            <p><strong>Description:</strong> {item.description}</p>
                            <p><strong>Contact:</strong> {item.contact}</p>
                            <button className="delete-button" onClick={() => handleDelete(item.id)}>Remove Item</button>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
