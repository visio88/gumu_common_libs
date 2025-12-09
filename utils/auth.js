import RevokedTokens from '../database/models/RevokedToken';
import { InternalServerError } from '../libs/error/HttpErrors';
import jwt from 'jsonwebtoken';

/**
 * Reusable Type definition for Verified promise response
 * @typedef {Object} VerificationResponse
 * @property {boolean} verified - Verified status
 * @property {string} message - Verified message
 */

/**
 * Get a token
 * @param {*} userInfo
 * @returns {string}
 */
export const generateToken = (userInfo) => {
  if (!userInfo) {
    return null;
  }

  // 60 * 1 means, 60s x 1 = 60s
  const token = jwt.sign(
    {
      data: userInfo,
    },
    process.env.JWT_SECRET,
    { expiresIn: '10h' }
  );
  return token;
};
/**
 * Verify token
 * @param {*} token
 * @returns {Promise<VerificationResponse>} verification
 */
export const verifyToken = async (loginMethodValue, token) => {
  const verifyPromise = new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        resolve({
          verified: false,
          message: err?.message || 'Invalid Token !',
        });
      }

      if (
        decoded.data.emailAddress !== loginMethodValue &&
        decoded.data.contactNumber !== loginMethodValue
      ) {
        resolve({
          verified: false,
          message: 'Invalid User',
        });
      }

      resolve({
        verified: true,
        message: 'Verified',
      });
    });
  });

  return verifyPromise;
};

/**
 * Verify token expiry
 * @param {*} token
 * @returns {Promise<VerificationResponse>} verification
 */
export const verifyTokenExpire = async (token) => {
  /**  @type {Promise<VerificationResponse>} */
  const verifyTokenPromise = new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        resolve({
          verified: false,
          message: err?.message || 'Invalid Token !',
        });
      }

      resolve({
        verified: true,
        message: 'Verified',
      });
    });
  });
  return verifyTokenPromise;
};
/**
 * Verify token from blacklist
 * @param {*} token
 * @param {*} conn
 * @returns {Promise<VerificationResponse} verification
 */
export const verifyTokenBlacklist = async (token, conn) => {
  if (!conn) {
    throw new InternalServerError('Error in connecting to database');
  }
  const checkIfBlacklisted = await RevokedTokens.findOne({ token }).exec();
  if (checkIfBlacklisted) {
    return {
      verified: false,
      message: 'This session has expired. Please re-login',
    };
  }
  return {
    verified: true,
    message: 'Verified',
  };
};
