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

// Your Netlify functions as Express routes
app.post('/api/generate-story', require('./netlify/functions/generate-story').handler);
app.post('/api/generate-image', require('./netlify/functions/generate-image').handler);
app.post('/api/generate-audio', require('./netlify/functions/generate-audio').handler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});