const express = require('express');
const cors=require('cors');
const bodyParser=require('body-parser');

const port=3001;
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

require('./routes/api-routes')(app)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});