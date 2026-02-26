const fs = require("fs");
const { createWasteText, getWasteHistory } = require("../../services/waste");
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

exports.classifyImage = asyncHandler(async (req, res) => {
    const id = req.id;
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const imagePath = req.file.path;
    console.log(imagePath);
    
    let aiResult = null;
    let aiError = null;
    let dbError = null;
    let deleteError = null;
    let audioUrl = null;
    let audioFilename = null;

    try {
        aiResult = await aiClassifier(imagePath);
        console.log("airesult:",aiResult);
        console.log("aierror:",aiError);

        
        
        const wasteTypeDb = mapWasteTypeToDb(aiResult.wasteType);
        const binColorDb = mapBinColorToDb(aiResult.binColor);

        const speechText = `This item is ${aiResult.wasteType}. Put it in the ${aiResult.binColor} bin. ${aiResult.suggestion}`;

        let audioResult = null;
        try {
            audioResult = await generateAudio(speechText);
            audioUrl = audioResult.url;
            audioFilename = audioResult.filename;
        } catch (audioError) {
            console.log("Audio generation failed:", audioError.message);
        }

        await Waste.create({
            userId: id,
            inputType: "image",
            inputValue: "image",
            wasteType: wasteTypeDb,
            binColor: binColorDb,
            suggestion: aiResult.suggestion,
            source: "ai",
            audioUrl: audioFilename,
        });
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
        console.log(aiError);
        
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

