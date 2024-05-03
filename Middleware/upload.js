const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage();

// Initialize multer upload
const upload = multer({ storage: storage });

module.exports = upload;
