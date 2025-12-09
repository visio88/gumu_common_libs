import mongoose from 'mongoose';
import logger from '../utils/logger';
import { MONGO_URI } from '../libs/const';

let conn = null;
/**
 * Establish database connection
 * @returns {Promise<import "mongoose".Connection>} connection
 */
const connectDatabase = async () => {
  if (conn == null) {
    conn = await mongoose
      .connect(MONGO_URI, { serverSelectionTimeoutMS: 7500, family: 4 })
      .then(logger.info('DB Connected Successfully'));
    return conn;
  }
  logger.info('Connection already established, reusing the existing connection');
  return conn;
};

export default connectDatabase;
