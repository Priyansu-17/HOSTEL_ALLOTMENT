import React, { useState, useEffect } from 'react';
import Seat from '../components/Seat';
import '../styles/seatSelection.css';

const Hostel = () => {
    const [seats, setSeats] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [floors, setFloors] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedSeat, setSelectedSeat] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/blocks')
            .then(response => response.json())
            .then(data => setBlocks(data));

        fetch('http://localhost:3001/api/floors')
            .then(response => response.json())
            .then(data => setFloors(data));
    }, []);

    useEffect(() => {
        if (selectedBlock && selectedFloor !== '') {
            fetch(`http://localhost:3001/api/seats?block=${selectedBlock}&floor=${selectedFloor}`)
                .then(response => response.json())
                .then(data => setSeats(data));
        }
    }, [selectedBlock, selectedFloor]);

    const handleSeatClick = (index) => {
        const newSeats = seats.map((seat, i) => ({
            ...seat,
            status: seat.status === 'selected' && i !== index ? 'available' : seat.status
        }));

        if (newSeats[index].status !== 'alloted') {
            newSeats[index].status = 'selected';
            setSelectedSeat(newSeats[index]);
        }

        setSeats(newSeats);
    };

    const handleFinalizeSelection = () => {
        if (selectedSeat) {
            fetch('http://localhost:3001/api/seats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedSeat.id, status: 'alloted' })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update the seat status in the UI
                        alert("Successfully confirmed ur seat")
                        const updatedSeats = seats.map(seat =>
                            seat.id === selectedSeat.id ? { ...seat, status: 'alloted' } : seat
                        );
                        setSeats(updatedSeats);
                        setSelectedSeat(null); // Clear the selected seat after finalizing
                        
                    } else {
                        alert('Failed to finalize seat selection.');
                    }
                });
        } else {
            alert('Please select a seat first.');
        }
    };

    if (blocks.length === 0 || floors.length === 0) return <p>Loading...</p>;

    return (
        <div className="container">
            <h1>Select Your Seat</h1>
            <div className="filters">
                <label>
                    Block:
                    <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)}>
                        <option value="">Select Block</option>
                        {blocks.map((block) => (
                            <option key={block} value={block}>{block}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Floor:
                    <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                        <option value="">Select Floor</option>
                        {floors.map((floor) => (
                            <option key={floor} value={floor}>{floor}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="seating">
                {seats.map((seat, index) => (
                    <Seat
                        key={seat.id}
                        roomNumber={seat.room_number}
                        status={seat.status}
                        onClick={() => handleSeatClick(index)}
                    />
                ))}
            </div>
            <button onClick={handleFinalizeSelection}>Finalize Your Seat Selection</button>
        </div>
    );
};

export default Hostel;
