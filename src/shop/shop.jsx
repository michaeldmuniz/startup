import React, { useEffect, useState } from 'react';
import { webSocketClient } from '../utils/websocket';

export function Shop() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [affirmation, setAffirmation] = useState(null);

    useEffect(() => {
        fetchItems();
        fetchAffirmation();
        
        // Set up WebSocket message handler
        const handleNewItem = (message) => {
            if (message.type === 'new_item') {
                setNotification(`New item listed: ${message.item.title}`);
                setItems(prevItems => [message.item, ...prevItems]);
                
                // Clear notification after 5 seconds
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            }
        };

        webSocketClient.addMessageHandler(handleNewItem);

        // Cleanup
        return () => {
            webSocketClient.removeMessageHandler(handleNewItem);
        };
    }, []);

    async function fetchAffirmation() {
        try {
            const response = await fetch('/api/daily-affirmation');
            if (!response.ok) {
                throw new Error('Failed to fetch affirmation');
            }
            const data = await response.json();
            setAffirmation(data.message);
        } catch (error) {
            console.error('Error fetching affirmation:', error);
        }
    }

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
            {affirmation && (
                <div className="affirmation">
                    <p>Daily Affirmation: {affirmation}</p>
                </div>
            )}
            <p>Browse through our items below!</p>
            {error && <p className="error-message">{error}</p>}
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
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
