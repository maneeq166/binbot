const { Router } = require("express");
const { createWasteRecordText, getWastes } = require("../../controllers/waste");
const { authMiddleware } = require("../../middleware/auth.middleware");

const router = Router();

router.post("/create", authMiddleware, createWasteRecordText);
router.get("/history", authMiddleware, getWastes);

module.exports = router;
