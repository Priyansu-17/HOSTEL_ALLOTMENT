const db = require("../Database/mysql.js")
const XLSX = require('xlsx');

const authenticateLogin = async (req,username, password) => {
  const query = `SELECT * FROM users WHERE admission_no = ? AND password = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [username, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(true);
          
          req.session.user= results[0].admission_no;
        } else {
          resolve(false);
        }
      }
    });
  });
};
const updateRoomInDatabase = (hostel,admissionNumber, newRoom) => {
  const query = `UPDATE ${hostel} SET room_number = ? WHERE student_alloted = ?`;
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

const swapRoomsInDatabase = async (hostel,admissionNumber1, admissionNumber2) => {
  try {
    // Retrieve current rooms for both students
    const getRoomQuery = `SELECT student_alloted, room_number FROM ${hostel} WHERE student_alloted IN (?, ?)`;
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
  const query = 'SELECT * FROM JASPER WHERE block = ? AND floor = ?';
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

const updateSeatStatus = (id, status ,user) => {
  const query = 'UPDATE JASPER SET status = ? , student_alloted = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [status, user, id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true });
      }
    });
  });
};

const fetchBlocks = () => {
  const query = 'SELECT DISTINCT block FROM JASPER';
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
  const query = 'SELECT DISTINCT floor FROM JASPER ORDER BY floor';
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



const updateHostelStudents = async (req, res) => {
  try {
    const files = req.files;
    const titles = req.body;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const title = titles[`title${index}`];

      if (!title) {
        return res.status(400).send(`Title for file ${file.originalname} is missing`);
      }

      // Read the Excel file
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Process the data
      const admissions = data.map(row => row[0]); // Assuming admission numbers are in the first column

      if (admissions.length === 0) {
        return res.status(400).send(`No admission numbers found in file ${file.originalname}`);
      }

      // Create or replace table with a primary key
      const tableName = `${title}-students`;
      await db.promise().query(`DROP TABLE IF EXISTS \`${tableName}\``);
      await db.promise().query(`CREATE TABLE \`${tableName}\` (
        admission_no VARCHAR(255) PRIMARY KEY
      )`);

      // Insert admission numbers
      const insertQuery = `INSERT INTO \`${tableName}\` (admission_no) VALUES ?`;
      const values = admissions.map(admission => [admission]);
      await db.promise().query(insertQuery, [values]);
    }

    res.status(200).send('Files processed and tables updated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
};

module.exports = {
  authenticateLogin,
  updateRoomInDatabase,
  swapRoomsInDatabase,
  fetchSeats,
  updateSeatStatus,
  fetchBlocks,
  fetchFloors,
  updateHostelStudents
};
