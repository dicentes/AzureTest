import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext} from './Login';
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const EditGoalModal = ({ isOpen, onClose, editGoal }) => {
  const [editedGoalTitle, setEditedGoalTitle] = useState("");
  const [editedGoalDesc, setEditedGoalDesc] = useState("");
  const [editedGoalCompleted, setEditedGoalCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    editGoal(editedGoalTitle, editedGoalDesc, editedGoalCompleted);
    onClose();
  }; 
  return isOpen ? (
    <div className="modal">
      <div className="modal-content">  {/* Open modal-content div */}
        <form onSubmit={handleSubmit}>
          <p> Target Date can not be modified. You set your goal - stick to it!</p>
          <input
            type="text"
            placeholder="New Goal Title"
            value={editedGoalTitle}
            onChange={(e) => setEditedGoalTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Goal Description"
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
      </div>  {/* Close modal-content div */}
    </div>
  ) : null;
  
};

function GoalDetail() {
  const { goalId } = useParams();
  const { authenticated, username } = useContext(AuthContext);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedGoalTitle, setEditedGoalTitle] = useState("");
  const [editedGoalDesc, setEditedGoalDesc] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const navigate = useNavigate();
  const [editedGoalCompleted, setEditedGoalCompleted] = useState(false);  // New state for edited goal completion status
  const [isModalOpen, setModalOpen] = useState(false);

  
  // Function to toggle the goal's completion status
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
        setGoal({ ...goal, completed: !goal.completed }); // Update local state
      } else {
        console.error('Failed to update the completion status');
      }
    } catch (error) {
      console.error(`Error updating completion status: ${error}`);
    }
  }
  // Function to delete a goal
  const deleteGoal = async () => {
    setDeleting(true);
    setDeleteMessage("Deleting Goal, standby...");
    try {
      const response = await fetch(`/api/goal/${goalId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteMessage("Goal successfully deleted");
        navigate('/dashboard'); 
      } else {
        setDeleteMessage("Failed to delete the goal");
      }
    } catch (error) {
      setDeleteMessage(`Error deleting goal: ${error}`);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    // Function to fetch goal data
    const fetchGoal = async () => {
      try {
        const response = await fetch(`/api/goal/${goalId}`);
        const rawResponse = await response.text();  // Fetch the raw response
        console.log("Raw response:", rawResponse);  // Log the raw response for debugging

        // Check if the fetch was successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse JSON from the recreated response object
        const parsedGoal = JSON.parse(rawResponse);
        setGoal(parsedGoal);  // Update the goal state
        setLoading(false);  // Update the loading state
      } catch (error) {
        console.error(`Failed to fetch goal: ${error}`);
        setLoading(false);  // Update the loading state even if fetch fails
      }
    };

    fetchGoal();  // Call the fetch function
  }, [goalId]);  // Reload the component if goalId changes


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
   // Updated function to edit a goal
   const editGoal = async (title, desc, completed) => {
    console.log("Sending data:", {
      RowKey: goalId,
      GoalTitle: title,
      GoalDesc: desc,
      Completed: completed,
    }); // Log data being sent
    try {
      const response = await fetch(`/api/editgoal/editgoal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RowKey: goalId,  // Pass the goalId as RowKey
          GoalTitle: title,  // Use parameter
          GoalDesc: desc,  // Use parameter
          Completed: completed  // Use parameter
        }),
      });
      
      if (response.ok) {
        setEditMessage("Goal successfully edited");
        navigate("/dashboard");
      } else {
        setEditMessage("Failed to edit the goal");
      }
    } catch (error) {
      setEditMessage(`Error editing goal: ${error}`);
    }
  };

  return (
    <div>
      {/* Display a loading message if the data is still being fetched */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Display various goal details */}
          <h1>{goal?.goalTitle}</h1>
          <p>Description: {goal?.goalDesc}</p>
          <p>Submitted by: {goal?.submittedBy}</p>
          <p>Target Date: {formatDate(goal?.targetDate)}</p>
          <p>Completed: {goal?.completed ? 'Yes' : 'No'}</p>
        
          
          {/* Buttons for editing and deleting, only show if authenticated and username matches */}
          {authenticated && username === goal?.submittedBy && !deleting && (
            <>
              <button onClick={() => setModalOpen(true)}>Edit this Goal</button>
              <button onClick={deleteGoal}>Delete this Goal</button>
            </>
          )}
          
          {/* Modal to edit the goal */}
          <EditGoalModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} editGoal={editGoal} />
        </div>
      )}
    </div>
  );  // End of return statement
};  // <-- This is the missing closing brace for the GoalDetail function component.

export default GoalDetail;  // Exporting the GoalDetail component
