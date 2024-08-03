import React, { useState } from 'react';
import AdminRow from '../subComponent/AdminRow.jsx';

const TableContainer = () => {
  const rows = [
    { title: 'Amber' },
    { title: 'Aquamarine' },
    { title: 'Diamond' },
    { title: 'Emerald' },
    { title: 'Jasper' },
    { title: 'Int' },
    { title: 'Opal' },
    { title: 'Rosaline' },
    { title: 'Sapphire' },
    { title: 'Topaz' },
  ];

  const [files, setFiles] = useState({});

  const handleFileChange = (index, file) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [index]: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.keys(files).forEach(index => {
      formData.append(`file${index}`, files[index]);
    });

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Files uploaded successfully');
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {rows.map((row, index) => (
        <AdminRow
          key={index}
          index={index}
          title={row.title}
          onFileChange={handleFileChange}
        />
      ))}
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default TableContainer;
