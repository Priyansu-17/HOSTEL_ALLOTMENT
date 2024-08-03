const db = require("../Database/mysql.js")

const updateRoomInDatabase = (admissionNumber, newRoom) => {
  const query = `UPDATE room_allotment SET room_number = ? WHERE student_alloted = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [newRoom, admissionNumber], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const swapRoomsInDatabase = async (admissionNumber1, admissionNumber2) => {
  try {
    // Retrieve current rooms for both students
    const getRoomQuery = `SELECT student_alloted, room_number FROM room_allotment WHERE student_alloted IN (?, ?)`;
    const [results] = await new Promise((resolve, reject) => {
      db.query(getRoomQuery, [admissionNumber1, admissionNumber2], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (results.length !== 2) {
      throw new Error('Failed to retrieve both students');
    }

    const room1 = results.find(row => row.student_alloted === admissionNumber1).room_number;
    const room2 = results.find(row => row.student_alloted === admissionNumber2).room_number;

    // Swap rooms
    await updateRoomInDatabase(admissionNumber1, room2);
    await updateRoomInDatabase(admissionNumber2, room1);

    return true;
  } catch (err) {
    console.error('Error swapping rooms:', err);
    return false;
  }
};

const fetchSeats = (block, floor) => {
  const query = 'SELECT * FROM total WHERE block = ? AND floor = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [block, floor], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateSeatStatus = (id, status) => {
  const query = 'UPDATE total SET status = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [status, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true });
      }
    });
  });
};

const fetchBlocks = () => {
  const query = 'SELECT DISTINCT block FROM total';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.map(row => row.block));
      }
    });
  });
};

const fetchFloors = () => {
  const query = 'SELECT DISTINCT floor FROM total ORDER BY floor';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.map(row => row.floor));
      }
    });
  });
};

module.exports = {
  updateRoomInDatabase,
  swapRoomsInDatabase,
  fetchSeats,
  updateSeatStatus,
  fetchBlocks,
  fetchFloors
};
