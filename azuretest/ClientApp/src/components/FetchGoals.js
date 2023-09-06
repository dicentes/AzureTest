import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Login';

function FetchGoals() {
  const { authenticated } = useContext(AuthContext);
  const [userGoals, setUserGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to convert ISO 8601 date to MM/DD/YYYY format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    populateUserGoals();
  }, []);

  // Function to render user goals as bubbles
  const renderUserGoalsAsBubbles = (goals) => {
    return (
      <div className="goal-container">
        {goals.map(userGoal => (
          <div key={userGoal.rowKey} className="goal-bubble">
            <Link to={`/goal/${userGoal.rowKey}`}>{userGoal.goalTitle}</Link>
            <p>{userGoal.goalDesc}</p>
            <p>{userGoal.submittedBy}</p>
            <p>{formatDate(userGoal.targetDate)}</p>
            <p>{userGoal.completed ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    );
  };

  // Function to populate user goals by fetching from the API
  const populateUserGoals = async () => {
    try {
      const response = await fetch('/api/usergoal');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setUserGoals(data);
      setLoading(false);
    } catch (error) {
      setError(`Server failed to retrieve data from database. Try again later. Error: ${error.message}`);
      setLoading(false);
    }
  };

  let contents;

  if (error) {
    contents = <p>{error}</p>;
  } else if (authenticated) {
    contents = loading ? <p><em>Loading...</em></p> : renderUserGoalsAsBubbles(userGoals);
  } else {
    contents = <p>You need to be logged in to view your goals. <a href="/login">Log in</a></p>;
  }

  return (
    <div>
      <h1 id="tableLabel">User Goals</h1>
      <p>This component demonstrates fetching user goals from the server.</p>
      {contents}
    </div>
  );
}

export default FetchGoals;
