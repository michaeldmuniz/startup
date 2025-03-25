import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Sell() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem('loggedInUser'));
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to sell items.');
            navigate('/login');
        }
    }, [user, navigate]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        if (!user) {
            setError('You must be logged in to create an item');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    price: parseFloat(price),
                    description,
                    category,
                    images
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    navigate('/login');
                    return;
                }
                throw new Error(errorData.msg || 'Failed to create item');
            }

            alert('Item successfully listed for sale!');
            navigate('/shop');
        } catch (error) {
            console.error('Error creating item:', error);
            setError(error.message || 'Failed to create item. Please try again.');
        }
    }

    function handleImageUpload(event) {
        const files = Array.from(event.target.files);
        const imagePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises)
            .then(imageUrls => {
                setImages(imageUrls);
            })
            .catch(error => {
                console.error('Error processing images:', error);
                setError('Failed to process images. Please try again.');
            });
    }

    return (
        <main className="form-container">
            <h1>List an Item for Sale</h1>
            {error && <p className="error-message">{error}</p>}
            <form className="form-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price ($):</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="images">Images:</label>
                    <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                </div>
                <div className="submit-button">
                    <button type="submit">List Item</button>
                </div>
            </form>
        </main>
    );
}
