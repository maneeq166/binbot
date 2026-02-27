require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const logrotate = require("logrotate-stream");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const rateLimit = require("express-rate-limit");

const swaggerSpec = require("./src/config/swagger/index");
const ApiResponse = require("./src/utils/apiResponse");
const { connectToDatabase } = require("./src/config/connection/index");
const { cleanupOldAudioFiles } = require("./src/services/ttsService");

const { MONGODB_URI, NODE_ENV, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI || !NODE_ENV || !PORT || !JWT_SECRET) {
  console.error(
    "Missing required environment variables: MONGODB_URI, NODE_ENV, PORT, JWT_SECRET",
    {
      MONGODB_URI,
      NODE_ENV,
      PORT,
      JWT_SECRET: Boolean(JWT_SECRET),
    }
  );
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
}));

// Force HTTPS in production
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/audio", express.static("audio"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Logging setup
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  const logDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const accessLogStream = logrotate({
    file: path.join(logDir, "access.log"),
    size: "10M",
    keep: 3,
    compress: true,
  });
  app.use(morgan("combined", { stream: accessLogStream }));
}

// Routes
app.get("/", (req, res) => res.send("Welcome to the binbot API"));
app.use("/api/auth",require("./src/routes/auth/index"));
app.use("/api/waste",require("./src/routes/waste/index"));
app.use("/api/dashboard",require("./src/routes/dashboard/index"));

//  404 Fallback
app.use((req, res, next) => {
  return res
    .status(404)
    .json(
      new ApiResponse(404, null, `Route ${req.originalUrl} not found`, null)
    );
});

//  Malformed JSON handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Invalid JSON format. Please check your request body."
        )
      );
  }
  return next(err);
});

//  Connect to MongoDB
connectToDatabase(MONGODB_URI);

//  Audio cleanup job - runs every hour
setInterval(() => {
  const maxAgeHours = process.env.AUDIO_MAX_AGE_HOURS || 24;
  cleanupOldAudioFiles(maxAgeHours).catch(console.error);
}, process.env.AUDIO_CLEANUP_INTERVAL || 60 * 60 * 1000);

//  Start listening
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
  });
}

module.exports = app;
