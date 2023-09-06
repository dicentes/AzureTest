import React, { useState } from 'react';
import { AuthContext, useAuth } from './Login';
import { useNavigate } from 'react-router-dom';

function AddGoalForm() {
  const [goalTitle, setGoalTitle] = useState('');
  const { authenticated, username } = useAuth(AuthContext);
  const [goalDesc, setGoalDesc] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const navigate = useNavigate();

  // Function to check if all required fields are filled
  const isValid = () => {
    return goalTitle && goalDesc && targetDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValid()) {
      const payload = {
        GoalTitle: goalTitle,
        GoalDesc: goalDesc,
        SubmittedBy: username,
        TargetDate: targetDate,
        Completed: false
      };
      console.log("Here is what the payload looks like", payload);
      const response = await fetch('/api/addgoal/addgoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert('Failed to add goal');
      }
    } else {
      alert('All fields must be filled');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Goal Title */}
      <input 
        type="text" 
        value={goalTitle} 
        onChange={(e) => setGoalTitle(e.target.value)} 
        placeholder="Goal Title" 
      />

      {/* Goal Description */}
      <input 
        type="text" 
        value={goalDesc} 
        onChange={(e) => setGoalDesc(e.target.value)} 
        placeholder="Goal Description" 
      />

      {/* Target Date */}
      <input 
        type="date" 
        value={targetDate} 
        onChange={(e) => setTargetDate(e.target.value)} 
        placeholder="Target Date" 
      />

      {/* Submit Button - Disabled if not all fields are filled */}
      <button type="submit" disabled={!isValid()}>Submit</button>
    </form>
  );
}

export default AddGoalForm;
