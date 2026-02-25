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
    if (!err) return next();
    let statusCode = err.statusCode || 400;
    let message = err.message || "File upload failed";
    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 400;
      message = "File size exceeds 5MB limit";
    }
    return res.status(statusCode).json({ success: false, message });
  });
};

module.exports = uploadMiddleware;
