import React, { useState, useEffect, useContext, createContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './Login';

// Create a GoalsContext
export const GoalsContext = createContext();

// GoalsProvider component to wrap around components that need to access goals state
// Custom hook to track changes to goals
const useGoalsChanged = () => {
  const [goalsChanged, setGoalsChanged] = useState(false);

  const markGoalsChanged = () => {
    console.log("Marking goals as changed. Will trigger a database query.");
    setGoalsChanged(true);
  };



  const markGoalsUpToDate = () => {
    console.log("Goals are up-to-date. No need for a new database query.");
    setGoalsChanged(false);
  };

  return { goalsChanged, markGoalsChanged, markGoalsUpToDate };
};

// GoalsProvider component
export const GoalsProvider = ({ children }) => {
  const [userGoals, setUserGoals] = useState([]);
  const { goalsChanged, markGoalsChanged, markGoalsUpToDate } = useGoalsChanged();
  const location = useLocation();  // Add this line


  const triggerUpdate = () => {
    markGoalsChanged();
  };
  // Define populateUserGoals here so it has access to setUserGoals
  const populateUserGoals = async () => {
    try {
      const response = await fetch('/api/usergoal');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      console.log("I've pulled this data from the database.");
      setUserGoals(data);
      markGoalsUpToDate();  // Mark goals as up-to-date after successful fetch
    } catch (error) {
      console.error(`Server failed to retrieve data. Error: ${error.message}`);
    }
  };

  // This useEffect checks if the goalsChanged state is true or if userGoals.length is zero.
  // If either is true, it will call populateUserGoals() to fetch fresh data.
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      console.log(`Current goalsChanged state: ${goalsChanged}`);
      console.log(`Current userGoals: ${JSON.stringify(userGoals)}`);
      if (goalsChanged || userGoals.length === 0) {
        console.log("Since the goals have been changed, or there are no goals, making a fresh database query.");
        populateUserGoals();
      }
    }
  }, [goalsChanged, location.pathname]);

  return (
    <GoalsContext.Provider value={{ userGoals, markGoalsChanged, triggerUpdate }}>
      {children}
    </GoalsContext.Provider>
  );
};
// FetchGoals component
export const FetchGoals = () => {
  const { authenticated } = useContext(AuthContext);
  const { userGoals, markGoalsChanged } = useContext(GoalsContext);
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
    if (userGoals.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [userGoals]);

  const renderUserGoalsAsBubbles = (goals) => {
    return (
      <div className="goal-container">
        {goals.map((userGoal) => (
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

  let contents;
  if (error) {
    contents = <p>{error}</p>;
  } else if (authenticated) {
    contents = loading ? <p><em>Loading...</em></p> : renderUserGoalsAsBubbles(userGoals);
  } else {
    contents = <p>You need to be logged in to view goals. <a href="/login">Log in</a></p>;
  }

  return (
    <div>
      <h1 id="tableLabel">User Goals</h1>
      <p>Login to see what goals others have posted and post your own.</p>
      {contents}
    </div>
  );
};

export default FetchGoals;
