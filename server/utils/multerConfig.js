const multer = require("multer");
const path = require("path");

const storage = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = (folderName) =>
  multer({
    storage: storage(folderName),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter,
  });

module.exports = upload;
