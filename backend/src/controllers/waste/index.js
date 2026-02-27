const fs = require("fs");
const { createWasteText, getWasteHistory, classifyWasteText } = require("../../services/waste");
const aiClassifier = require("../../services/aiClassifier");
const { generateAudio } = require("../../services/ttsService");
const Waste = require("../../models/waste.model");
const ApiError = require("../../utils/apiError");
const ApiResponse = require("../../utils/apiResponse");
const { asyncHandler } = require("../../utils/asyncHandler/index");

const mapWasteTypeToDb = value => {
    const v = String(value || "").trim().toLowerCase();
    if (v === "biodegradable") return "biodegradable";
    return "non-biodegradable";
};

const mapBinColorToDb = value => {
    const v = String(value || "").trim().toLowerCase();
    if (v === "green" || v === "blue" || v === "black") return v;
    return "black";
};

exports.createWasteRecordText = asyncHandler(async(req,res)=>{
    const id = req.id;
    const {wastename}= req.body;

    const {message,statusCode,data}=await createWasteText(id,wastename);
    return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));

})
exports.getWastes=asyncHandler(async(req,res)=>{
    const id = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {message,statusCode,data}=await getWasteHistory(id, page, limit);
    return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
})

exports.classifyText = asyncHandler(async (req, res) => {
    const { wastename } = req.body;

    const result = await classifyWasteText(wastename);

    const speechText = `This item is ${result.wasteType}. Put it in the ${result.binColor} bin. ${result.suggestion}`;

    let audioUrl = null;
    try {
        const audioResult = await generateAudio(speechText);
        audioUrl = audioResult.url;
    } catch (audioError) {
        console.error("Audio generation failed:", audioError.message);
    }

    return res.status(200).json({
        success: true,
        data: {
            ...result,
            audioUrl,
        },
    });
});

exports.classifyImage = asyncHandler(async (req, res) => {
    const id = req.id;
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Validate file
    const file = req.file;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new ApiError(400, "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new ApiError(400, "File too large. Maximum size is 5MB.");
    }

    const imagePath = req.file.path;
    
    let aiResult = null;
    let aiError = null;
    let dbError = null;
    let deleteError = null;
    let audioUrl = null;
    let audioFilename = null;

    try {
        aiResult = await aiClassifier(imagePath);
        console.log("airesult:",aiResult);

        if (aiResult.isWaste === false) {
            console.log("Rejected image:", aiResult.reason);
            return res.status(400).json({
                success: false,
                message: "Uploaded image is not a waste item"
            });
        }

        const wasteTypeDb = mapWasteTypeToDb(aiResult.wasteType);
        const binColorDb = mapBinColorToDb(aiResult.binColor);

        const speechText = `This item is ${aiResult.wasteType}. Put it in the ${aiResult.binColor} bin. ${aiResult.suggestion}`;

        let audioResult = null;
        try {
            audioResult = await generateAudio(speechText);
            audioUrl = audioResult.url;
            audioFilename = audioResult.filename;
        } catch (audioError) {
            console.error("Audio generation failed:", audioError.message);
        }

        await Waste.create({
            userId: id,
            inputType: "image",
            inputValue: req.file.filename,
            itemName: aiResult.itemName,
            wasteType: wasteTypeDb,
            binColor: binColorDb,
            suggestion: aiResult.suggestion,
            source: "ai",
            audioUrl,
        });

        console.log("Saved itemName:", aiResult.itemName);
    } catch (err) {
        if (!aiResult) {
            aiError = err;
        } else {
            dbError = err;
        }
    } finally {
        try {
            await fs.promises.unlink(imagePath);
        } catch (err) {
            deleteError = err;
        }
    }

    if (aiError) {
        console.error("AI classification error:", aiError);
        
        throw new ApiError(500, "AI classification failed");
    }
    if (dbError) {
        throw new ApiError(500, "Failed to save waste record");
    }
    if (deleteError) {
        throw new ApiError(500, "Failed to delete temporary file");
    }

    return res.status(200).json({
        success: true,
        data: {
            wasteType: aiResult.wasteType,
            binColor: aiResult.binColor,
            suggestion: aiResult.suggestion,
            confidence: aiResult.confidence,
            disposalGuide: aiResult.suggestion,
            audioUrl,
        },
    });
});
