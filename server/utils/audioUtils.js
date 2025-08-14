/**
 * Convert audio buffer to base64
 * @param {Buffer} audioBuffer - Audio buffer
 * @returns {string} Base64 encoded audio
 */
export function convertAudioToBase64(audioBuffer) {
  return audioBuffer.toString('base64');
}

/**
 * Validate audio format by checking base64 string
 * @param {string} audioBase64 - Base64 encoded audio
 * @returns {boolean} True if valid audio format
 */
export function validateAudioFormat(audioBase64) {
  try {
    // Basic validation - check if it's valid base64
    const buffer = Buffer.from(audioBase64, 'base64');
    return buffer.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Convert data URL to base64
 * @param {string} dataUrl - Data URL (data:audio/wav;base64,...)
 * @returns {string} Base64 string
 */
export function dataUrlToBase64(dataUrl) {
  if (dataUrl.includes(',')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
}

/**
 * Create audio data URL from base64
 * @param {string} base64 - Base64 audio data
 * @param {string} mimeType - MIME type (default: audio/wav)
 * @returns {string} Data URL
 */
export function createAudioDataUrl(base64, mimeType = 'audio/wav') {
  return `data:${mimeType};base64,${base64}`;
}