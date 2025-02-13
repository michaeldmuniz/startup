import React from 'react';

export function Sell() {
  return (
    <main className="form-container">  
      <h1 className="form-header">Sell Your Item</h1>
      <form className="form-form" action="/submit-sell-item" method="POST">
        <div className="form-group">
          <label htmlFor="item-name">Item Name:</label>
          <input type="text" id="item-name" name="item-name" placeholder="Enter item name" required />
        </div>

        <div className="form-group">
          <label htmlFor="item-price">Price:</label>
          <input type="number" id="item-price" name="item-price" placeholder="Enter item price" required />
        </div>

        <div className="form-group">
          <label htmlFor="item-description">Description:</label>
          <textarea id="item-description" name="item-description" placeholder="Describe the item" required></textarea>
        </div>

        <div className="form-group file-input-group">
          <label htmlFor="item-image" className="file-input-label">Item Image:</label>
          <input type="file" id="item-image" name="item-image" className="file-input" />
        </div>

        <div className="submit-button">
          <button type="submit">Submit Item</button>
        </div>
      </form>
    </main>
  );
}
