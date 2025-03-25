import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function MyItems() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem('loggedInUser'));
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to view your items.');
            navigate('/login');
        } else {
            fetchItems();
        }
    }, [user, navigate]);

    async function fetchItems() {
        try {
            const response = await fetch('/api/items/user');
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

//
//     async function handleDelete(itemId) {
//         try {
//             const response = await fetch(`/api/items/${itemId}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete item');
//             }

            // Update the items list after successful deletion
//            setItems(items.filter(item => item.id !== itemId));
//            alert('Item successfully removed.');
//        } catch (error) {
//            console.error('Error deleting item:', error);
//            setError('Failed to delete item. Please try again.');
//        }
//    }

    return (
        <main className="app-container">
            <h1>My Listed Items</h1>
            <p>Manage the items you have posted for sale.</p>
            {error && <p className="error-message">{error}</p>}
            <div className="items-list">
                {items.length === 0 ? (
                    <p>You haven't listed any items for sale.</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="item">
                            <h2>{item.title}</h2>
                            {item.images && item.images.length > 0 && (
                                <img src={item.images[0]} alt={item.title} />
                            )}
                            <p><strong>Price:</strong> ${item.price}</p>
                            <p><strong>Description:</strong> {item.description}</p>
                            <p><strong>Category:</strong> {item.category}</p>
                            {/* <button className="delete-button" onClick={() => handleDelete(item.id)}>Remove Item</button> */}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
