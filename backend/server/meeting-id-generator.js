import crypto from 'crypto';

// Secret key for encryption - should be in .env in production
const SECRET_KEY = process.env.MEETING_SECRET_KEY || 'webrtc-secret-key-2024';

/**
 * Generate a secure meeting ID from a session ID
 * Uses HMAC-SHA256 to create a one-way hash that can't be reversed
 * @param {string} sessionId - The session ID
 * @returns {string} - Secure meeting ID (12 characters)
 */
export const generateMeetingId = (sessionId) => {
  // Create HMAC hash using session ID
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(sessionId.toString());
  const hash = hmac.digest('hex');

  // Take first 12 characters and convert to uppercase for readability
  const meetingId = hash.substring(0, 12).toUpperCase();

  return meetingId;
}

/**
 * Verify if a meeting ID matches a session ID
 * @param {string} meetingId - The meeting ID to verify
 * @param {string} sessionId - The session ID to check against
 * @returns {boolean} - True if they match
 */
export const verifyMeetingId = (meetingId, sessionId) => {
  const expectedMeetingId = generateMeetingId(sessionId);
  return meetingId.toUpperCase() === expectedMeetingId.toUpperCase();
}

/**
 * Generate a completely random meeting ID
 * @returns {string} - Random meeting ID (12 characters)
 */
export const generateRandomMeetingId = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}


