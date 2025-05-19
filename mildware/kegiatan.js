const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './kegiatan/'); // Set destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set unique filename
  },
});

//filter file type
const fileFilter = (req, file, cb) => {
  const filetypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (filetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File format not supported'), false);
  }
};

const kegiatan = multer({
  storage,
  fileFilter,
});

module.exports = kegiatan;

