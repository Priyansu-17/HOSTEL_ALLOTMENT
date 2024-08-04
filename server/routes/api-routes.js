const path = require('path');
const controller = require('../controller/controller');
require('dotenv').config();

module.exports = function (app) {

  // // PAGES
  // const HOSTEL = path.join(__dirname, "../../client/public", "index.html");

  // // public routes
  // const ROUTE_FOR_HOSTEL_PAGE = '/Hostel/:id';

  // API
  const API_TO_UPDATE_ROOM = '/api/updateRoom';
  const API_TO_SWAP_ROOMS = '/api/swapRooms';
  const API_TO_POST_LOGIN_CREDENTIALS = '/login-details'

  app.post(API_TO_POST_LOGIN_CREDENTIALS, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }
    try {
      const isAuthenticated = await controller.authenticateLogin(req, username, password);
      if (isAuthenticated) {
        if (username === process.env.admin_username && password === process.env.admin_password) {
          res.json({ success: true, role: 'admin', message: 'Login successful' });
        }
        else {
          res.json({ success: true, role: 'student', message: 'Login successful' });
        }
      } else {
        res.json({ success: false, message: 'Invalid username or password' });
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  app.get('/api/check-session', (req, res) => {
    console.log("from check session",req.session.user);
    if (req.session.user) {
      res.json({ isAuthenticated: true, user: req.session.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  app.get('/api/logout', (req, res) => {
    if (req.session.user) {
      req.session.destroy(err => {
        if (err) {
          return res.json({ success: false });
        }
        res.clearCookie('user_sid');
        return res.json({ success: true });
      });
    } else {
      res.json({ success: false });
    }
  });

  app.put(API_TO_UPDATE_ROOM, async (req, res) => {
    const { admissionNumber, newRoom } = req.body;
    if (!admissionNumber || !newRoom) {
      return res.status(400).json({ error: 'Admission number and new room are required' });
    }
    try {
      await controller.updateRoomInDatabase(admissionNumber, newRoom);
      res.status(200).send('Room updated successfully');
    } catch (error) {
      res.status(500).send('Failed to update room');
    }
  });

  app.post(API_TO_SWAP_ROOMS, async (req, res) => {
    const { admissionNumber1, admissionNumber2 } = req.body;
    if (!admissionNumber1 || !admissionNumber2) {
      return res.status(400).json({ error: 'Both admission numbers are required' });
    }
    const success = await controller.swapRoomsInDatabase(admissionNumber1, admissionNumber2);

    if (success) {
      res.status(200).send('Rooms swapped successfully');
    } else {
      res.status(500).send('Failed to swap rooms');
    }
  });

  app.get('/api/seats', async (req, res) => {
    const { block, floor } = req.query;
    if (!block || floor === undefined) {
      return res.status(400).json({ error: 'Block and floor are required' });
    }
    try {
      const results = await controller.fetchSeats(block, floor);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/api/seats', async (req, res) => {
    const { id, status } = req.body;
    try {
      const result = await controller.updateSeatStatus(id, status);
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/api/blocks', async (req, res) => {
    try {
      const results = await controller.fetchBlocks();
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/api/floors', async (req, res) => {
    try {
      const results = await controller.fetchFloors();
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });


}
