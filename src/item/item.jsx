import React from 'react';

export function Login() {
  return (
    <main class="app-container">
        <h1>Item Name (Placeholder)</h1>
        <div class="item-container">
            <img src="public/Capture.JPG" alt="Item Image"/>
            <div class="item-details">
                <p>Price: $XXX</p>
                <p>Description: Placeholder for item description.</p>
                <button>Message Seller</button>
            </div>
        </div>
        <section>
            <h2>Websocket data</h2>
            <p>Websocket data will be used to send messages to the server and receive real-time data from the server without needing to refresh the web page</p>
        </section>
    </main>
  );
}
