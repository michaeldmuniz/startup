import React, { useEffect, useState } from 'react';

export function Shop() {
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState('... listening for messages ...');

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('shopItems')) || [];
        setItems(storedItems);

        const interval = setInterval(() => {
            const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const newMsg = `${randomName} has items in their cart.`;
            setMsg(newMsg);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="app-container">
            <h1>Welcome to Our Shop</h1>
            <p>Browse through our items below!</p>
            <div className="items-list">
                {items.length === 0 ? (
                    <p>No items available for sale. Be the first to list one!</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="item">
                            <h2>{item.name}</h2>
                            <p><strong>Brand:</strong> {item.brand}</p>
                            {item.image && <img src={item.image} alt={item.name} />}
                            <p><strong>Price:</strong> ${item.price}</p>
                            <p><strong>Description:</strong> {item.description}</p>
                            <p><strong>Seller:</strong> {item.seller}</p>
                            <p><strong>Contact:</strong> {item.contact}</p>
                        </div>
                    ))
                )}
            </div>
            <div>
                {msg}
            </div>
        </main>
    );
}
