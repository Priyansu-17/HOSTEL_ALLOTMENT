const path = require('path');
const controller = require('../controller/controller');

module.exports = function (app) {

  // PAGES
  const HOSTEL = path.join(__dirname, "../../client/public", "index.html");

  // public routes
  const ROUTE_FOR_HOSTEL_PAGE = '/Hostel/:id';

  // API
  const API_TO_UPDATE_ROOM = '/api/updateRoom';
  const API_TO_SWAP_ROOMS = '/api/swapRooms';

  app.get(ROUTE_FOR_HOSTEL_PAGE, (req, res) => {
    res.sendFile(HOSTEL);
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
