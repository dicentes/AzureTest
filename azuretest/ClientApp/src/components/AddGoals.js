import React, { useState, useContext } from 'react';
import { AuthContext, useAuth } from './Login';
import { useNavigate } from 'react-router-dom';
import { GoalsContext } from './FetchGoals';

function AddGoalForm() {
  const [goalTitle, setGoalTitle] = useState('');
  const { authenticated, username } = useAuth(AuthContext);
  const [goalDesc, setGoalDesc] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const navigate = useNavigate();
  const { triggerUpdate } = useContext(GoalsContext);

  // Function to check if all required fields are filled and not blank
  const isValid = () => {
    return goalTitle.trim() && goalDesc.trim() && targetDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValid()) {
      const payload = {
        GoalTitle: goalTitle.trim(),
        GoalDesc: goalDesc.trim(),
        SubmittedBy: username,
        TargetDate: targetDate,
        Completed: false
      };
      const response = await fetch('/api/addgoal/addgoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        triggerUpdate(); // Update the goals state in the context
        navigate("/dashboard");
      } else {
        alert('Failed to add goal');
      }
    } else {
      alert('All fields must be filled and cannot be blank');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={goalTitle} 
        onChange={(e) => setGoalTitle(e.target.value)} 
        placeholder="Goal Title" 
      />
      <input 
        type="text" 
        value={goalDesc} 
        onChange={(e) => setGoalDesc(e.target.value)} 
        placeholder="Goal Description" 
      />
      <input 
        type="date" 
        value={targetDate} 
        onChange={(e) => setTargetDate(e.target.value)} 
        placeholder="Target Date" 
      />
      <button type="submit" disabled={!isValid()}>Submit</button>
    </form>
  );
}

export default AddGoalForm;
