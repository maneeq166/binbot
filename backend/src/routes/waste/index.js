const { Router } = require("express");
const { createWasteRecordText, getWastes, classifyImage } = require("../../controllers/waste");
const uploadMiddleware = require("../../middleware/uploadMiddleware");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = Router();

router.post("/create", authMiddleware, createWasteRecordText);
router.post("/classify-image", authMiddleware, uploadMiddleware, classifyImage);
router.get("/history", authMiddleware, getWastes);

module.exports = router;
