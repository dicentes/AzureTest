import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './Login';

const Logout = () => {
  const { authenticated, logout } = useContext(AuthContext);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  let contents;

  useEffect(() => {
    if (authenticated) {
      setWasAuthenticated(true);
      logout();
    }
  }, [authenticated, logout]);

  if (wasAuthenticated) {
    contents = <p>You have been logged out.</p>;
  } else {
    contents = (
      <p>
        You need to be logged in to view your goals.{' '}
        <a href="/login">Log in</a>
      </p>
    );
  }
  
  return (
    <div>
      <p>This is a test of Authentication.</p>
      {contents}
    </div>
  );
};

export default Logout;
