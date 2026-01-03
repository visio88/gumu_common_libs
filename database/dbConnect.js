import mongoose from 'mongoose';
import logger from '../utils/logger';
import { MONGO_URI } from '../libs/const';

let conn = null;
/**
 * Establish database connection
 * @returns {Promise<import "mongoose".Connection>} connection
 */
const connectDatabase = async () => {
  // Check if connection exists and is ready (readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
  const readyState = mongoose.connection.readyState;
  
  if (conn == null || readyState === 0 || readyState === 3) {
    // Connection doesn't exist, is disconnected, or is disconnecting - create new connection
    // Mongoose 9.x compatible options
    const connectionOptions = {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    };
    
    conn = await mongoose
      .connect(MONGO_URI, connectionOptions)
      .then(() => {
        logger.info('DB Connected Successfully');
        return mongoose.connection;
      });
    return conn;
  }
  
  // Connection is ready (1 = connected)
  if (readyState === 1) {
    logger.info('Connection already established, reusing the existing connection');
    return conn;
  }
  
  // Connection is in connecting state (2), wait for it to complete
  if (readyState === 2) {
    logger.info('Connection in progress, waiting...');
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        mongoose.connection.removeListener('connected', resolve);
        mongoose.connection.removeListener('error', reject);
        reject(new Error('Connection timeout after 20000ms'));
      }, 20000);
      
      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      
      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
    return conn;
  }
  
  // If we get here, connection is in an unexpected state, reconnect
  logger.warn(`Connection in unexpected state (${readyState}), reconnecting...`);
  conn = null;
  return connectDatabase();
};
export default connectDatabase;

