import React, { useState } from 'react';

const EditRow = ({ admissionNumber, currentRoom, onUpdateRoom }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newRoom, setNewRoom] = useState(currentRoom);

  const handleEditClick = async () => {
    if (isEditing) {
      const response = await fetch('http://localhost:3001/api/updateRoom', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admissionNumber,
          newRoom,
        }),
      });

      if (response.ok) {
        onUpdateRoom(admissionNumber, newRoom);
      } else {
        alert("Failed to update room")
        console.error('Failed to update room');
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <tr>
      <td>{admissionNumber}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
        ) : (
          currentRoom
        )}
      </td>
      <td>
        <button onClick={handleEditClick}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </td>
    </tr>
  );
};

export default EditRow;
