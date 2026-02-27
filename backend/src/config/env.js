exports.secrets ={
    MONGODB_URI: process.env.MONGODB_URI || (() => { throw new Error('MONGODB_URI is required'); })(),
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is required'); })(),
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || (() => { throw new Error('GEMINI_API_KEY is required'); })(),
    AI_CONFIDENCE_THRESHOLD: process.env.AI_CONFIDENCE_THRESHOLD || 40,
    AUDIO_CLEANUP_INTERVAL: process.env.AUDIO_CLEANUP_INTERVAL || 3600000,
    AUDIO_MAX_AGE_HOURS: process.env.AUDIO_MAX_AGE_HOURS || 24,
    AI_MODEL: process.env.AI_MODEL || 'gemini-2.5-flash',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    DEV_API_URL: process.env.DEV_API_URL || 'http://localhost:5000',
    PROD_API_URL: process.env.PROD_API_URL || '',
}