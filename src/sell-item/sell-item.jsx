import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Sell() {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem('loggedInUser'));
    const [itemName, setItemName] = useState('');
    const [brand, setBrand] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [itemImage, setItemImage] = useState(null);

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to sell items.');
            navigate('/login');
        }
    }, [user, navigate]);

    function handleSubmit(event) {
        event.preventDefault();

        let items = JSON.parse(localStorage.getItem('shopItems')) || [];

        const newItem = {
            id: Date.now(),
            name: itemName,
            brand: brand,
            price: itemPrice,
            description: itemDescription,
            contact: contactInfo,
            image: itemImage,
            seller: user,
        };

        items.push(newItem);
        localStorage.setItem('shopItems', JSON.stringify(items));

        alert('Item successfully listed for sale!');
        navigate('/shop');
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setItemImage(reader.result);
            reader.readAsDataURL(file);
        }
    }

    return (
        <main className="form-container">  
            <h1 className="form-header">Sell Your Item</h1>
            <form className="form-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="item-name">Item Name:</label>
                    <input type="text" id="item-name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" required />
                </div>

                <div className="form-group">
                    <label htmlFor="brand">Brand Name:</label>
                    <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Enter brand name (e.g., Nike, Apple)" required />
                </div>

                <div className="form-group">
                    <label htmlFor="item-price">Price:</label>
                    <input type="number" id="item-price" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="Enter item price" required />
                </div>

                <div className="form-group">
                    <label htmlFor="item-description">Description:</label>
                    <textarea id="item-description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Describe the item" required></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="contact-info">Contact Information:</label>
                    <input type="text" id="contact-info" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Enter email or phone number" required />
                </div>

                <div className="form-group file-input-group">
                    <label htmlFor="item-image">Item Image:</label>
                    <input type="file" id="item-image" onChange={handleImageUpload} />
                </div>

                <div className="submit-button">
                    <button type="submit">Submit Item</button>
                </div>
            </form>
        </main>
    );
}
