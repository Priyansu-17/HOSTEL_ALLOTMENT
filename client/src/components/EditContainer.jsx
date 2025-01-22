import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EditRow from '../subComponent/EditRow.jsx'
const FetchStudents = () => {
  const { hostel } = useParams(); // Extract the hostel name from the URL
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/students/${hostel}`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [hostel]);

  return (
    <div>
      <h2>{hostel} Students</h2>
      <div>
        {students.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <EditRow
                  key={index}
                  admissionNumber={student.admission_no}
                  currentRoom={student.room}
                  onUpdateRoom={(admissionNumber, newRoom) => {
                    setStudents((prevStudents) =>
                      prevStudents.map((s) =>
                        s.admission_no === admissionNumber
                          ? { ...s, room: newRoom }
                          : s
                      )
                    );
                  }}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found.</p>
        )}
      </div>
    </div>
  );
};

export default FetchStudents;
