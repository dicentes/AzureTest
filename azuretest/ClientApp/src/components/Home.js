import React, { useContext, useEffect, useState } from 'react';
import { GoalsContext } from './FetchGoals';  // Import GoalsContext
import discobolus from './noun-discobolus-1310560.svg';

export const Home = () => {
  const { userGoals } = useContext(GoalsContext);  // Destructure userGoals from GoalsContext
  const [completedGoals, setCompletedGoals] = useState([]);

  // Function to convert ISO 8601 date to MM/DD/YYYY format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Use useEffect to filter only completed goals
  useEffect(() => {
    const filteredGoals = userGoals.filter(goal => goal.completed);
    setCompletedGoals(filteredGoals);
  }, [userGoals]);

  // Function to render completed goals
  const renderCompletedGoals = (goals) => {
    return (
      <div className="goal-container">
        {goals.map((userGoal) => (
          <div key={userGoal.rowKey} className="goal-bubble">
            <h3>Goal Title: {userGoal.goalTitle}</h3>
            <p>Description: {userGoal.goalDesc}</p>
            <p>Submitted By: {userGoal.submittedBy}</p>
            <p>Completed By: {formatDate(userGoal.targetDate)}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="d-flex justify-content-between textbox">
        <div>
          <p>Welcome to Brocountability.</p>
          <p>Setting goals for yourself can be easy - <i>completing </i> them is hard. Brocountability is here to fix that.</p>
          <p>Register now to make an account and join other bros looking to improve themselves.</p>
          <div>
        <h2>Look at what others have accomplished...</h2>
        {renderCompletedGoals(completedGoals)}
        <h2> Register now to add your own goals. </h2>
      </div>
        </div>
        <img src={discobolus} alt="test icon" width="500" height="600" className="img-fluid frontpageimage" style={{maxWidth: '100%'}} />
      </div>
    
    </div>
  );
}  
