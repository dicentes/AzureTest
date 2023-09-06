import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null); //new code
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (storedToken) {
      setAuthenticated(true);
      setToken(storedToken);
      setUsername(storedUsername); // Added this line
    }
  }, []);

  const login = (newToken, newUser) => { // Added newUser parameter
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('username', newUser); // Added this line
    setAuthenticated(true);
    setToken(newToken);
    setUsername(newUser); // Added this line
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username'); 
    setAuthenticated(false);
    setToken(null);
    setUsername(null); // Added this line
  };

  return (
    <AuthContext.Provider value={{ authenticated, token, username, login, logout }}> 
      {children}
    </AuthContext.Provider>
  ); // important that any values that need to accessed outside of Login.js are in this authcontext provider
};

const useAuth = () => {
  return useContext(AuthContext);
};

const Login = () => {
  const [userSubmittedUsername, setUserSubmittedUsername] = useState('');
  const [userSubmittedPassword, setUserSubmittedPassword] = useState('');
  const { login } = useAuth();
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userSubmittedUsername,
          password: userSubmittedPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Login successful message
        login(data.token, userSubmittedUsername);
      } else {
        console.error(data.message);
        alert('Invalid credentials'); // Invalid credentials message
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while logging in.');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={userSubmittedUsername} onChange={(event) => setUserSubmittedUsername(event.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={userSubmittedPassword} onChange={(event) => setUserSubmittedPassword(event.target.value)} />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export { AuthProvider, useAuth, Login, AuthContext };
