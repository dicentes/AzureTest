import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './Login';
import { GoalsContext } from './FetchGoals'; // Import the GoalsContext

const EditGoalModal = ({ isOpen, onClose, editGoal, existingTitle, existingDesc }) => {
  const [editedGoalTitle, setEditedGoalTitle] = useState(existingTitle);
  const [editedGoalDesc, setEditedGoalDesc] = useState(existingDesc);
  const [editedGoalCompleted, setEditedGoalCompleted] = useState(false);

  // Function to check if the title and description are not blank
  const isValid = () => {
    return editedGoalTitle.trim() && editedGoalDesc.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid()) {
      editGoal(editedGoalTitle.trim(), editedGoalDesc.trim(), editedGoalCompleted);
      onClose();
    } else {
      alert("Title and Description cannot be blank.");
    }
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <p>Target Date cannot be modified. You set your goal - stick to it!</p>
          <input
            type="text"
            value={editedGoalTitle}
            onChange={(e) => setEditedGoalTitle(e.target.value)}
          />
          <input
            type="text"
            value={editedGoalDesc}
            onChange={(e) => setEditedGoalDesc(e.target.value)}
          />
          <label>
            Completed
            <input type="checkbox" onChange={(e) => setEditedGoalCompleted(e.target.checked)} />
          </label>
          <button type="submit">Submit Changes</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  ) : null;
};

function GoalDetail() {
  const { goalId } = useParams();
  const { authenticated, username } = useContext(AuthContext);
  const { markGoalsChanged } = useContext(GoalsContext);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  // ... (existing fetch, delete, and toggle functions)

  const toggleCompleted = async () => {
    try {
      const response = await fetch(`/api/editgoal/editgoal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RowKey: goalId,
          Completed: !goal.completed,
        }),
      });
      
      if (response.ok) {
        setGoal({ ...goal, completed: !goal.completed });
        markGoalsChanged(); // Mark goals as changed
      } else {
        console.error('Failed to update the completion status');
      }
    } catch (error) {
      console.error(`Error updating completion status: ${error}`);
    }
  };

  const deleteGoal = async () => {
    try {
      const response = await fetch(`/api/goal/${goalId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        markGoalsChanged(); // Mark goals as changed
        navigate('/dashboard'); 
      } else {
        console.error("Failed to delete the goal");
      }
    } catch (error) {
      console.error(`Error deleting goal: ${error}`);
    }
  };

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await fetch(`/api/goal/${goalId}`);
        const data = await response.json();
        setGoal(data);
        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch goal: ${error}`);
        setLoading(false);
      }
    };
    fetchGoal();
  }, [goalId]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const editGoal = async (title, desc, completed) => {
    try {
      const response = await fetch(`/api/editgoal/editgoal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RowKey: goalId,
          GoalTitle: title,
          GoalDesc: desc,
          Completed: completed,
        }),
      });
      
      if (response.ok) {
        markGoalsChanged(); // Mark goals as changed
        navigate("/dashboard");
      } else {
        console.error("Failed to edit the goal");
      }
    } catch (error) {
      console.error(`Error editing goal: ${error}`);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{goal.goalTitle}</h1>
          <p>Description: {goal.goalDesc}</p>
          <p>Target Date: {formatDate(goal.targetDate)}</p>
          <p>Completed: {goal.completed ? 'Yes' : 'No'}</p>
          {authenticated && username === goal.submittedBy && (
            <>
              <button onClick={() => setModalOpen(true)}>Edit this Goal</button>
              <button onClick={deleteGoal}>Delete this Goal</button>
            </>
          )}
          <EditGoalModal 
            isOpen={isModalOpen} 
            onClose={() => setModalOpen(false)} 
            editGoal={editGoal} 
            existingTitle={goal.goalTitle}  // Pass existing title
            existingDesc={goal.goalDesc}    // Pass existing description
          />
        </div>
      )}
    </div>
  );
}

export default GoalDetail;
