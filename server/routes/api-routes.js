

const fs = require('fs')
const path = require('path')
const controller = require("../controller/controller.js");

module.exports = function (app) {

    //PAGES
    const HOSTEL = path.join(__dirname, "../../client/public", "index.html");
    //public routes
    const ROUTE_FOR_HOSTEL_PAGE = '/Hostel/:id';


    // API
    const API_TO_UPDATE_ROOM = '/api/updateRoom';
    const API_TO_SWAP_ROOMS = '/api/swapRooms';


    app.get(ROUTE_FOR_HOSTEL_PAGE, (req, res) => {
        res.sendFile(HOSTEL);
    })


    app.put(API_TO_UPDATE_ROOM, (req, res) => {
        const { admissionNumber, newRoom } = req.body;
        const success = updateRoomInDatabase(admissionNumber, newRoom);

        if (success) {
            res.status(200).send('Room updated successfully');
        } else {
            res.status(500).send('Failed to update room');
        }
    });

    function updateRoomInDatabase(admissionNumber, newRoom) {
        return true; 
    }

    app.post(API_TO_SWAP_ROOMS, (req, res) => {
        const { admissionNumber1, admissionNumber2 } = req.body;
        const success = swapRoomsInDatabase(admissionNumber1, admissionNumber2);
      
        if (success) {
          res.status(200).send('Rooms swapped successfully');
        } else {
          res.status(500).send('Failed to swap rooms');
        }
      });

      function swapRoomsInDatabase(admissionNumber1, admissionNumber2) {
        return true; 
      }
}