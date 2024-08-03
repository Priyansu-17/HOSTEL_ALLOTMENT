import React, { useState } from 'react';
import EditRow from '../subComponent/EditRow.jsx';

const EditContainer = () => {
  const [rows, setRows] = useState([
    { admissionNumber: 'A001', currentRoom: '101' },
    { admissionNumber: 'A002', currentRoom: '102' },
    { admissionNumber: 'A003', currentRoom: '103' },
    // Add more rows as needed
  ]);

  const handleUpdateRoom = (admissionNumber, newRoom) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.admissionNumber === admissionNumber
          ? { ...row, currentRoom: newRoom }
          : row
      )
    );
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Admission Number</th>
          <th>Current Room Allotted</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <EditRow
            key={index}
            admissionNumber={row.admissionNumber}
            currentRoom={row.currentRoom}
            onUpdateRoom={handleUpdateRoom}
          />
        ))}
      </tbody>
    </table>
  );
};

export default EditContainer;
