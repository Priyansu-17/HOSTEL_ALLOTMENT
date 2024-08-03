// src/components/Seat.js
import React from 'react';
import '../styles/seat.css';

const Seat = ({ roomNumber, status, onClick }) => {
    return (
        <div className={`seat ${status}`} onClick={onClick}>
            <span>Room No: {roomNumber}</span>
            {/* <span>{status}</span> */}
        </div>
    );
};

export default Seat;
