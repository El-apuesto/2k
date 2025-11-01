const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve your main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes - using the simple backend folder
app.post('/api/generate-story', require('./simple-backend/generate-story').handler);
app.post('/api/generate-image', require('./simple-backend/generate-image').handler);
app.post('/api/generate-audio', require('./simple-backend/generate-audio').handler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
