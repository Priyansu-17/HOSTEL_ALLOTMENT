const db = require("../Database/mysql.js")
const XLSX = require('xlsx');
const fs = require('fs')
const authenticateLogin = async (req, username, password) => {
  if (username === process.env.admin_username && password === process.env.admin_password) {
    req.session.user='ADMIN'
    return true;
  }
  else {
    const query = `SELECT * FROM STUDENTS WHERE admission_no = ? AND password = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [username, password], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve(true);

            req.session.user = results[0].admission_no;
          } else {
            resolve(false);
          }
        }
      });
    });
  }
};

const getHostelList = (req,res,Hostel) =>{
  const query = `SELECT * FROM ${Hostel}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
}

const checkAdmissionExists = (hostel, admissionNumber) => {
  if(admissionNumber==='NA')return true;
  return new Promise((resolve, reject) => {
    // Correctly use backticks for table name interpolation
    const query = `SELECT COUNT(*) AS count FROM \`${hostel}-STUDENTS\` WHERE \`admission_no\` = ?`;
    
    db.query(query, [admissionNumber], (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log(results[0]);
      resolve(results[0].count > 0);
    });
  });
};


const updateRoomInDatabase = (hostel, newAdmissionNumber, roomNumber) => {
  console.log(hostel, newAdmissionNumber, roomNumber);

  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        return reject(err);
      }

      // Step 1: Clear old assignment from the room (if any)
      const clearOldAssignmentQuery = `UPDATE ${hostel} SET student_alloted = NULL WHERE room_number = ? AND student_alloted IS NOT NULL`;
      db.query(clearOldAssignmentQuery, [roomNumber], (err) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        // Step 2: Assign the new admission number to the room
        let assignNewAdmissionQuery;
        if (newAdmissionNumber === 'NA') {
          assignNewAdmissionQuery = `UPDATE ${hostel} SET student_alloted = ?, status = 'available' WHERE room_number = ?`;
        } else {
          assignNewAdmissionQuery = `UPDATE ${hostel} SET student_alloted = ?, status = 'alloted' WHERE room_number = ?`;
        }

        db.query(assignNewAdmissionQuery, [newAdmissionNumber, roomNumber], (err) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => reject(err));
            }
            resolve('Update successful');
          });
        });
      });
    });
  });
};



const swapUpdateRoomInDatabase = (hostel, admissionNumber, newRoom) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        return reject(err);
      }

      // Assign the admission number to the new room
      const assignNewRoomQuery = `UPDATE ${hostel} SET student_alloted = ? WHERE room_number = ?`;
      db.query(assignNewRoomQuery, [admissionNumber, newRoom], (err, results) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        if (results.affectedRows === 0) {
          return db.rollback(() => reject(new Error('Admission number not found or room not found')));
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => reject(err));
          }
          resolve('Update successful');
        });
      });
    });
  });
};

const swapRoomsInDatabase = async (hostel, admissionNumber1, admissionNumber2) => {
  try {
    const getRoomQuery = `SELECT student_alloted, room_number FROM ${hostel} WHERE student_alloted IN (?, ?)`;
    const results = await new Promise((resolve, reject) => {
      db.query(getRoomQuery, [admissionNumber1, admissionNumber2], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    if (results.length !== 2) {
      throw new Error('Failed to retrieve both students');
    }

    const room1 = results.find(row => row.student_alloted === admissionNumber1).room_number;
    const room2 = results.find(row => row.student_alloted === admissionNumber2).room_number;

    await swapUpdateRoomInDatabase(hostel, admissionNumber1, room2);
    await swapUpdateRoomInDatabase(hostel, admissionNumber2, room1);

    return true;
  } catch (err) {
    console.error('Error swapping rooms:', err);
    return false;
  }
};



const fetchSeats = (Hostel,block, floor) => {
  const query = `SELECT * FROM ${Hostel} WHERE block = ? AND floor = ?`;
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

const updateSeatStatus = (Hostel,id, status, user) => {
  const query = `UPDATE ${Hostel} SET status = ? , student_alloted = ? WHERE id = ?`;
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

const fetchBlocks = (Hostel) => {
  const query = `SELECT DISTINCT block FROM ${Hostel}`;
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

const fetchFloors = (Hostel) => {
  const query = `SELECT DISTINCT floor FROM ${Hostel} ORDER BY floor`;
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

const checkAllocation = async (Hostel,user) => {
  try {
    const getRoomQuery = `SELECT student_alloted, room_number FROM ${Hostel} WHERE student_alloted IN ('${user}')`;
    const results = await new Promise((resolve, reject) => {
      db.query(getRoomQuery, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    console.log(results);
    return (results.length == 0) ? false : true;
  } catch (err) {
    console.error('Error swapping rooms:', err);
    return false;
  }
};

const updateHostelStudents = async (Hostel, req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('File is missing');
    }

    if (!Hostel) {
      return res.status(400).send('Hostel name is missing');
    }

    // Read the Excel file
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Process the data
    const admissions = data.map(row => row[0]); // Assuming admission numbers are in the first column

    if (admissions.length === 0) {
      // Delete the file before returning
      fs.unlinkSync(file.path);
      return res.status(400).send('No admission numbers found in file');
    }

    // Create or replace table with a primary key
    const tableName = `${Hostel}-STUDENTS`;
    await db.promise().query(`DROP TABLE IF EXISTS \`${tableName}\``);
    await db.promise().query(`CREATE TABLE \`${tableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      admission_no VARCHAR(255)
    )`);

    // Insert admission numbers
    const insertQuery = `INSERT INTO \`${tableName}\` (admission_no) VALUES ?`;
    const values = admissions.map(admission => [admission]);
    await db.promise().query(insertQuery, [values]);

    // Delete the file after processing
    fs.unlinkSync(file.path);

    res.status(200).send('File processed and table updated successfully');
  } catch (error) {
    console.error('Error:', error);
    // Ensure the file is deleted even if there's an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).send('An error occurred');
  }
};

const downloadAllotedList = async (Hostel,req, res) => {
  try {
    // Fetch data from the database
    const [rows] = await db.promise().query(`SELECT student_alloted, room_number FROM ${Hostel} WHERE student_alloted IS NOT NULL`);

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Write the workbook to a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set the response headers and send the file
    res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('An error occurred while generating the Excel file');
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
  updateHostelStudents,
  downloadAllotedList,
  getHostelList,
  checkAdmissionExists,
  checkAllocation
};
