-- Create Animals table
CREATE TABLE IF NOT EXISTS animals (
  id TEXT PRIMARY KEY,
  name TEXT,
  breed TEXT,
  dob TEXT,
  gender TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create HealthData table
CREATE TABLE IF NOT EXISTS health_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id TEXT,
  date TEXT,
  heart_rate REAL,
  temperature REAL,
  activity REAL,
  FOREIGN KEY (animal_id) REFERENCES animals (id)
);

-- Create Pregnancy table
CREATE TABLE IF NOT EXISTS pregnancy_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id TEXT,
  status TEXT,
  gestation_days INTEGER,
  expected_due_date TEXT,
  last_checkup TEXT,
  fetal_heart_rate REAL,
  notes TEXT,
  FOREIGN KEY (animal_id) REFERENCES animals (id)
);

-- Create Pregnancy Stats table for daily tracking
CREATE TABLE IF NOT EXISTS pregnancy_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id TEXT,
  date TEXT,
  temperature REAL,
  heart_rate REAL,
  fetal_heart_rate REAL,
  activity REAL,
  notes TEXT,
  FOREIGN KEY (animal_id) REFERENCES animals (id)
);

-- Clear existing data to avoid duplicates on restart
DELETE FROM health_data;
DELETE FROM pregnancy_data;
DELETE FROM pregnancy_stats;
DELETE FROM animals;

-- Insert sample animals
INSERT INTO animals (id, name, breed, dob, gender) VALUES
  ('A12345', 'Daisy', 'Holstein', '2022-03-15', 'Female'),
  ('A12346', 'Bella', 'Jersey', '2021-07-22', 'Female'),
  ('A12347', 'Max', 'Angus', '2022-01-10', 'Male'),
  ('A12348', 'Rosie', 'Hereford', '2023-02-05', 'Female'),
  ('A12349', 'Duke', 'Brahman', '2022-09-18', 'Male');

-- Insert pregnancy data
INSERT INTO pregnancy_data (animal_id, status, gestation_days, expected_due_date, last_checkup, fetal_heart_rate, notes) VALUES
  ('A12345', 'Confirmed', 150, '2025-09-20', '2025-04-15', 175, 'Healthy pregnancy'),
  ('A12346', 'Confirmed', 90, '2025-11-15', '2025-04-10', 180, 'Normal development'),
  ('A12347', 'Not Pregnant', 0, '', '', 0, ''),
  ('A12348', 'Confirmed', 210, '2025-07-25', '2025-04-05', 158, 'Slightly low fetal heart rate, monitoring'),
  ('A12349', 'Not Pregnant', 0, '', '', 0, '');

-- Insert health data for the last 7 days
-- A12345 - showing infection pattern
INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES
  ('A12345', date('now', '-6 days'), 72, 38.5, 8),
  ('A12345', date('now', '-5 days'), 74, 38.7, 8),
  ('A12345', date('now', '-4 days'), 73, 39.0, 7),
  ('A12345', date('now', '-3 days'), 90, 39.5, 5),
  ('A12345', date('now', '-2 days'), 102, 40.0, 3),
  ('A12345', date('now', '-1 day'), 98, 40.2, 2),
  ('A12345', date('now'), 95, 40.3, 1);

-- A12346 - showing normal health
INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES
  ('A12346', date('now', '-6 days'), 75, 38.3, 9),
  ('A12346', date('now', '-5 days'), 74, 38.4, 8),
  ('A12346', date('now', '-4 days'), 76, 38.5, 9),
  ('A12346', date('now', '-3 days'), 75, 38.3, 9),
  ('A12346', date('now', '-2 days'), 73, 38.4, 8),
  ('A12346', date('now', '-1 day'), 72, 38.2, 9),
  ('A12346', date('now'), 74, 38.3, 8);

-- A12347 - showing mild concern
INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES
  ('A12347', date('now', '-6 days'), 70, 38.4, 8),
  ('A12347', date('now', '-5 days'), 72, 38.5, 7),
  ('A12347', date('now', '-4 days'), 75, 38.7, 6),
  ('A12347', date('now', '-3 days'), 78, 38.9, 6),
  ('A12347', date('now', '-2 days'), 83, 39.2, 5),
  ('A12347', date('now', '-1 day'), 81, 39.1, 6),
  ('A12347', date('now'), 79, 38.9, 7);

-- A12348 - showing pregnancy with complications
INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES
  ('A12348', date('now', '-6 days'), 77, 38.6, 7),
  ('A12348', date('now', '-5 days'), 79, 38.7, 7),
  ('A12348', date('now', '-4 days'), 82, 38.8, 6),
  ('A12348', date('now', '-3 days'), 85, 38.7, 6),
  ('A12348', date('now', '-2 days'), 84, 39.0, 5),
  ('A12348', date('now', '-1 day'), 88, 39.2, 5),
  ('A12348', date('now'), 90, 39.4, 4);

-- A12349 - showing recovery from illness
INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES
  ('A12349', date('now', '-6 days'), 95, 40.1, 3),
  ('A12349', date('now', '-5 days'), 92, 39.8, 4),
  ('A12349', date('now', '-4 days'), 88, 39.5, 5),
  ('A12349', date('now', '-3 days'), 84, 39.2, 6),
  ('A12349', date('now', '-2 days'), 80, 38.9, 7),
  ('A12349', date('now', '-1 day'), 77, 38.7, 8),
  ('A12349', date('now'), 75, 38.5, 8);

-- Insert pregnancy stats data for Bella (A12346) - 14 days of data
INSERT INTO pregnancy_stats (animal_id, date, temperature, heart_rate, fetal_heart_rate, activity, notes) VALUES
  ('A12346', date('now', '-14 days'), 38.2, 73, 173, 7.8, 'Normal daily check'),
  ('A12346', date('now', '-13 days'), 38.4, 75, 176, 8.1, 'Normal daily check'),
  ('A12346', date('now', '-12 days'), 38.5, 74, 175, 8.0, 'Normal daily check'),
  ('A12346', date('now', '-11 days'), 38.3, 72, 174, 7.9, 'Normal daily check'),
  ('A12346', date('now', '-10 days'), 38.4, 73, 177, 8.2, 'Slight decrease in appetite'),
  ('A12346', date('now', '-9 days'), 38.5, 75, 176, 8.0, 'Normal daily check'),
  ('A12346', date('now', '-8 days'), 38.2, 71, 172, 7.5, 'Normal daily check'),
  ('A12346', date('now', '-7 days'), 38.6, 76, 178, 8.3, 'Increased water intake'),
  ('A12346', date('now', '-6 days'), 38.3, 74, 175, 8.2, 'Normal daily check'),
  ('A12346', date('now', '-5 days'), 38.5, 75, 177, 8.1, 'Normal daily check'),
  ('A12346', date('now', '-4 days'), 38.4, 74, 180, 8.4, 'Fetal movement observed'),
  ('A12346', date('now', '-3 days'), 38.3, 73, 176, 8.2, 'Normal daily check'),
  ('A12346', date('now', '-2 days'), 38.5, 75, 178, 8.3, 'Normal daily check'),
  ('A12346', date('now', '-1 day'), 38.4, 74, 175, 8.0, 'Normal daily check');