import React, { useEffect, useState } from 'react';

export function Shop() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        try {
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to load items. Please try again later.');
        }
    }

    return (
        <main className="app-container">
            <h1>Welcome to Our Shop</h1>
            <p>Browse through our items below!</p>
            {error && <p className="error-message">{error}</p>}
            <div className="items-list">
                {items.length === 0 ? (
                    <p>No items available for sale. Be the first to list one!</p>
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="item">
                            <h2>{item.title}</h2>
                            {item.images && item.images.length > 0 && (
                                <img src={item.images[0]} alt={item.title} />
                            )}
                            <p><strong>Price:</strong> ${item.price}</p>
                            <p><strong>Description:</strong> {item.description}</p>
                            <p><strong>Category:</strong> {item.category}</p>
                            <p><strong>Seller:</strong> {item.sellerEmail}</p>
                            {item.sellerMessage && (
                                <p><strong>Seller's Message:</strong> {item.sellerMessage}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
