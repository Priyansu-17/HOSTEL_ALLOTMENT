import React from 'react';

const AdminRow = ({ index, title, onFileChange }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(index, file);
  };

  return (
    <div className="admin-row-div">
      <div className="admin-row-title">{title}</div>
      <div className="admin-row-file-upload">
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          className="file-input"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default AdminRow;
