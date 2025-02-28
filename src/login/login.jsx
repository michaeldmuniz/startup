import React from 'react';
import { useNavigate } from 'react-router-dom';




export function Login({setUser}) {
  const [text, setText] = React.useState('')
  const navigate = useNavigate();

  function loginUser() {
    localStorage.setItem('user',text);
    setUser(text);
    navigate('/Shop')
  }

  function textChange(e){
    setText(e.target.value)
  }

  return (
    <main className="form-container">
      <h1 className="form-header">Sign In</h1>
      <form className="form-form" action="/submit-signin" method="POST">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" onChange={textChange} id="username" name="username" placeholder="Enter your username" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />
        </div>
        
        <div className="submit-button">
          <button type="submit" onClick={loginUser}>Sign In</button>
        </div>
      </form>
      <section className="form-info">
        <p>Websocket data will be used to send messages to the server and receive real-time data from the server without needing to refresh the web page</p>
      </section>
    </main>
  );
}

