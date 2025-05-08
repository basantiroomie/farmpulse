
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'cattle_health.db');
const db = new Database(dbPath);

// Create database tables if they don't exist
const initDatabase = () => {
  // Create Animals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS animals (
      id TEXT PRIMARY KEY,
      name TEXT,
      breed TEXT,
      dob TEXT,
      gender TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create HealthData table
  db.exec(`
    CREATE TABLE IF NOT EXISTS health_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id TEXT,
      date TEXT,
      heart_rate REAL,
      temperature REAL,
      activity REAL,
      FOREIGN KEY (animal_id) REFERENCES animals (id)
    )
  `);
  
  // Create Pregnancy table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pregnancy_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id TEXT,
      status TEXT,
      gestation_days INTEGER,
      expected_due_date TEXT,
      last_checkup TEXT,
      fetal_heart_rate REAL,
      FOREIGN KEY (animal_id) REFERENCES animals (id)
    )
  `);
  
  console.log("Database initialized successfully");
  
  // Clear existing data to avoid duplicates on restart
  db.prepare('DELETE FROM health_data').run();
  db.prepare('DELETE FROM pregnancy_data').run();
  db.prepare('DELETE FROM animals').run();
  
  // Insert sample data
  insertSampleData();
};

// Insert enhanced sample data for testing
function insertSampleData() {
  console.log("Inserting enhanced sample data");
  
  // Insert sample animals - expanding to 5 animals
  const animals = [
    { id: 'A12345', name: 'Daisy', breed: 'Holstein', dob: '2022-03-15', gender: 'Female' },
    { id: 'A12346', name: 'Bella', breed: 'Jersey', dob: '2021-07-22', gender: 'Female' },
    { id: 'A12347', name: 'Max', breed: 'Angus', dob: '2022-01-10', gender: 'Male' },
    { id: 'A12348', name: 'Rosie', breed: 'Hereford', dob: '2023-02-05', gender: 'Female' },
    { id: 'A12349', name: 'Duke', breed: 'Brahman', dob: '2022-09-18', gender: 'Male' }
  ];
  
  const insertAnimal = db.prepare('INSERT INTO animals (id, name, breed, dob, gender) VALUES (?, ?, ?, ?, ?)');
  
  animals.forEach(animal => {
    try {
      insertAnimal.run(animal.id, animal.name, animal.breed, animal.dob, animal.gender);
    } catch (e) {
      console.log(`Error inserting animal ${animal.id}: ${e.message}`);
    }
  });
  
  // Insert sample health data for the last 7 days
  const insertHealthData = db.prepare('INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES (?, ?, ?, ?, ?)');
  const today = new Date();
  
  // Sample data for A12345 - showing infection pattern
  const heartRateA12345 = [72, 74, 73, 90, 102, 98, 95];
  const temperatureA12345 = [38.5, 38.7, 39, 39.5, 40, 40.2, 40.3];
  const activityA12345 = [8, 8, 7, 5, 3, 2, 1];
  
  // Sample data for A12346 - showing normal health
  const heartRateA12346 = [75, 74, 76, 75, 73, 72, 74];
  const temperatureA12346 = [38.3, 38.4, 38.5, 38.3, 38.4, 38.2, 38.3];
  const activityA12346 = [9, 8, 9, 9, 8, 9, 8];
  
  // Sample data for A12347 - showing mild concern
  const heartRateA12347 = [70, 72, 75, 78, 83, 81, 79];
  const temperatureA12347 = [38.4, 38.5, 38.7, 38.9, 39.2, 39.1, 38.9];
  const activityA12347 = [8, 7, 6, 6, 5, 6, 7];
  
  // Sample data for A12348 - showing pregnancy with complications
  const heartRateA12348 = [77, 79, 82, 85, 84, 88, 90];
  const temperatureA12348 = [38.6, 38.7, 38.8, 38.7, 39.0, 39.2, 39.4];
  const activityA12348 = [7, 7, 6, 6, 5, 5, 4];
  
  // Sample data for A12349 - showing recovery from illness
  const heartRateA12349 = [95, 92, 88, 84, 80, 77, 75];
  const temperatureA12349 = [40.1, 39.8, 39.5, 39.2, 38.9, 38.7, 38.5];
  const activityA12349 = [3, 4, 5, 6, 7, 8, 8];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    // Insert data for all animals
    insertHealthData.run('A12345', dateStr, heartRateA12345[i], temperatureA12345[i], activityA12345[i]);
    insertHealthData.run('A12346', dateStr, heartRateA12346[i], temperatureA12346[i], activityA12346[i]);
    insertHealthData.run('A12347', dateStr, heartRateA12347[i], temperatureA12347[i], activityA12347[i]);
    insertHealthData.run('A12348', dateStr, heartRateA12348[i], temperatureA12348[i], activityA12348[i]);
    insertHealthData.run('A12349', dateStr, heartRateA12349[i], temperatureA12349[i], activityA12349[i]);
  }
  
  // Insert pregnancy data
  const insertPregnancyData = db.prepare('INSERT INTO pregnancy_data (animal_id, status, gestation_days, expected_due_date, last_checkup, fetal_heart_rate) VALUES (?, ?, ?, ?, ?, ?)');
  
  insertPregnancyData.run('A12345', 'Confirmed', 150, '2025-09-20', '2025-04-15', 175);
  insertPregnancyData.run('A12346', 'Confirmed', 90, '2025-11-15', '2025-04-10', 180);
  insertPregnancyData.run('A12347', 'Not Pregnant', 0, '', '', 0);
  insertPregnancyData.run('A12348', 'Confirmed', 210, '2025-07-25', '2025-04-05', 158); // Slightly low fetal heart rate
  insertPregnancyData.run('A12349', 'Not Pregnant', 0, '', '', 0);
  
  console.log("Enhanced sample data inserted successfully");
}

// Initialize the database
initDatabase();

module.exports = {
  db,
  initDatabase
};
