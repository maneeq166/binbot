const fs = require("fs");
const path = require("path");
const https = require("https");

const AUDIO_DIR = path.join(__dirname, "../../audio");

function ensureAudioDir() {
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }
}

function downloadAudio(text) {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=en&client=tw-cm`;

    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, { headers: { "User-Agent": "Mozilla/5.0" } }, (res2) => {
            if (res2.statusCode !== 200) {
              reject(new Error(`Redirect failed: HTTP ${res2.statusCode}`));
              return;
            }
            const chunks = [];
            res2.on("data", (chunk) => chunks.push(chunk));
            res2.on("end", () => resolve(Buffer.concat(chunks)));
            res2.on("error", reject);
          }).on("error", reject);
          return;
        }
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });

    req.on("error", reject);
  });
}

async function generateAudio(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Invalid text input for TTS");
  }

  ensureAudioDir();

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filename = `tts_${timestamp}_${randomSuffix}.mp3`;
  const filepath = path.join(AUDIO_DIR, filename);

  try {
    console.log("Generating TTS for:", text);
    const audioBuffer = await downloadAudio(text);
    console.log("Audio buffer size:", audioBuffer.length);

    if (!audioBuffer || audioBuffer.length < 1000) {
      throw new Error("Invalid audio response, size: " + (audioBuffer?.length || 0));
    }

    await fs.promises.writeFile(filepath, audioBuffer);

    return {
      filepath,
      filename,
      url: `/audio/${filename}`,
    };
  } catch (error) {
    console.error("TTS generation failed:", error.message);

    if (fs.existsSync(filepath)) {
      try {
        await fs.promises.unlink(filepath);
      } catch (cleanupError) {
        console.error("Failed to cleanup failed audio file:", cleanupError.message);
      }
    }

    throw error;
  }
}

async function cleanupOldAudioFiles(maxAgeHours = 24) {
  try {
    ensureAudioDir();

    const files = await fs.promises.readdir(AUDIO_DIR);
    const now = Date.now();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

    for (const file of files) {
      if (!file.startsWith("tts_") || !file.endsWith(".mp3")) {
        continue;
      }

      const filepath = path.join(AUDIO_DIR, file);
      const stats = await fs.promises.stat(filepath);

      if (now - stats.mtimeMs > maxAgeMs) {
        await fs.promises.unlink(filepath);
        console.log(`Deleted old audio file: ${file}`);
      }
    }
  } catch (error) {
    console.error("Failed to cleanup old audio files:", error.message);
  }
}

function getAudioUrl(filename) {
  if (!filename) return null;
  return `/audio/${filename}`;
}

module.exports = {
  generateAudio,
  cleanupOldAudioFiles,
  getAudioUrl,
};
