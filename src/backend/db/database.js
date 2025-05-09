import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Use an in-memory database instead of a file
const db = new Database(':memory:');

// Initialize the database with schema from SQL file
const initDatabase = () => {
  try {
    // Read and execute the SQL schema file
    const sqlPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the schema SQL
    db.exec(schemaSQL);
    
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

// Export using ES modules syntax
export { db, initDatabase };