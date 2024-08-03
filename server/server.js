const express = require('express');

const app = express();
// Middleware
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../client')));


require('./routes/api-routes')(app)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
