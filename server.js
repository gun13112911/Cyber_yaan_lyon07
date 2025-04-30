const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files from 'public'
app.use(express.static('public'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST /submit handler
app.post('/submit', upload.single('photo'), (req, res) => {
  const { username, password } = req.body;
  const photo = req.file ? req.file.path : 'No photo uploaded';

  // Log data
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Photo:', photo);

  // Prepare data string
  const dataString = `Username: ${username}, Password: ${password}, Photo: ${photo}\n`;

  // Append to file
  fs.appendFile('user-data.txt', dataString, (err) => {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).send('Something went wrong');
    }

    res.redirect('/success.html');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
