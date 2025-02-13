import React from 'react';

export function Login() {
  return (
    <main className="login-container">
      <h1 className="login-header">Sign In</h1>
      <form className="login-form" action="/submit-signin" method="POST">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />
        </div>
        
        <div className="submit-button">
          <button type="submit">Sign In</button>
        </div>
      </form>

      <section className="login-info">
        <h2>Authentication</h2>
        <p>Websocket data will be used to send messages to the server and receive real-time data from the server without needing to refresh the web page</p>
      </section>
    </main>
  );
}
