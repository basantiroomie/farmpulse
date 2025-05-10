import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load environment variables from multiple locations
const envPaths = [
  path.join(__dirname, '../../..', '.env'),  // Project root
  path.join(__dirname, '../..', '.env'),     // src directory
  path.join(__dirname, '..', '.env')         // backend directory
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment from ${envPath}`);
    dotenv.config({ path: envPath });
    break;
  }
}

// MongoDB connection URL from env or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmpulse';
const USE_SQLITE = process.env.USE_SQLITE === 'true';

// Connect to MongoDB
const connectMongoDB = async () => {
  // If USE_SQLITE is true, skip MongoDB connection
  if (USE_SQLITE) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️ USE_SQLITE=true in .env, skipping MongoDB connection');
    return false;
  }
  
  try {
    // Set a shorter timeout for connection attempts during development
    const options = {
      serverSelectionTimeoutMS: 2000,  // Reduce timeout to 2 seconds for faster feedback
      connectTimeoutMS: 2000,
      family: 4  // Force IPv4, can help with some connection issues
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️ MongoDB connection failed. Using in-memory/SQLite storage for device data.');
    console.log('\x1b[33m%s\x1b[0m', '⚠️ This is normal during development if MongoDB is not installed or running.');
    console.log('\x1b[33m%s\x1b[0m', '⚠️ For full functionality with device registration:');
    console.log('\x1b[36m%s\x1b[0m', '   1. Install MongoDB: brew install mongodb-community');
    console.log('\x1b[36m%s\x1b[0m', '   2. Start MongoDB: brew services start mongodb-community');
    console.log('\x1b[36m%s\x1b[0m', '   3. Or set USE_SQLITE=true in .env to use SQLite for all storage');
    console.log('\x1b[33m%s\x1b[0m', '⚠️ The application will continue to work with limited functionality.');
    return false;
  }
};

export { connectMongoDB, mongoose };
