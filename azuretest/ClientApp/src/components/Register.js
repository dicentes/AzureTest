import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
  const [userSubmittedUsername, setUserSubmittedUsername] = useState('');
  const [userSubmittedPassword, setUserSubmittedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    setError(null); // Reset any previous errors
    

    try {
      const response = await fetch('/api/registration/register', {
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
        console.log(data.message); // Registration successful message
        navigate('/login'); 
      } else {
        console.error(data.message);
        console.log(data.message);
        setError('Registration failed, try again later'); // Set error state
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Registration failed, try again later'); // Set error state
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={userSubmittedUsername} onChange={(event) => setUserSubmittedUsername(event.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={userSubmittedPassword} onChange={(event) => setUserSubmittedPassword(event.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
      {isLoading && <p>Sending request...</p>} {/* Display when loading */}
      {error && <p>{error}</p>} {/* Display when error */}
    </div>
  );
};

export default Register;
