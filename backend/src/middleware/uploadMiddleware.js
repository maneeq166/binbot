const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      cb(null, UPLOAD_DIR);
    } catch (err) {
      console.error(`Error creating upload directory: ${err}`);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const random = Math.floor(Math.random() * 1e9);
    cb(null, `${Date.now()}-${random}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed.");
    err.statusCode = 400;
    console.error(`Error filtering file: ${err}`);
    return cb(err);
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadSingle = upload.single("image");

const uploadMiddleware = (req, res, next) => {
  uploadSingle(req, res, err => {

    if (err) {

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 5MB limit"
        });
      }

      return res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "File upload failed"
      });
    }

    // THIS is correct validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    next();
  });
};

module.exports = uploadMiddleware;

