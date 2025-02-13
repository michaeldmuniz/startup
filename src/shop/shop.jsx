import React from 'react';

  export function Shop() {
    return (
        <main class="app-container">
            <h1>Welcome to Our Shop</h1>
            <p>Browse through our items below!</p>
            <div class="items-list">
                <div class="item">
                    <h2>Item 1</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $10</p>
                    <button onclick="window.location.href='item.html?id=1'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 2</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $20</p>
                    <button onclick="window.location.href='item.html?id=2'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 3</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $30</p>
                    <button onclick="window.location.href='item.html?id=3'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 4</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $40</p>
                    <button onclick="window.location.href='item.html?id=4'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 5</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $50</p>
                    <button onclick="window.location.href='item.html?id=5'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 6</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $60</p>
                    <button onclick="window.location.href='item.html?id=6'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 7</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $70</p>
                    <button onclick="window.location.href='item.html?id=7'">View Item</button>
                </div>
                <div class="item">
                    <h2>Item 8</h2>
                    <img src="public/Capture.JPG" alt="Item Image"/>
                    <p>Price: $80</p>
                    <button onclick="window.location.href='item.html?id=8'">View Item</button>
                </div>
            </div>
        </main>
    );
  }

