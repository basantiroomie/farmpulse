
const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get all animals
router.get('/animals', (req, res) => {
  try {
    const animals = db.prepare('SELECT * FROM animals').all();
    res.json({ success: true, data: animals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get animal by ID
router.get('/animals/:id', (req, res) => {
  try {
    const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ success: false, error: 'Animal not found' });
    }
    
    res.json({ success: true, data: animal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get health data for an animal
router.get('/animals/:id/health', (req, res) => {
  try {
    const healthData = db.prepare(`
      SELECT * FROM health_data 
      WHERE animal_id = ? 
      ORDER BY date ASC
    `).all(req.params.id);
    
    res.json({ success: true, data: healthData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get pregnancy data for an animal
router.get('/animals/:id/pregnancy', (req, res) => {
  try {
    const pregnancyData = db.prepare(`
      SELECT * FROM pregnancy_data 
      WHERE animal_id = ?
    `).get(req.params.id);
    
    if (!pregnancyData) {
      return res.json({ 
        success: true, 
        data: { 
          animal_id: req.params.id,
          status: 'Unknown',
          gestation_days: 0,
          expected_due_date: '',
          last_checkup: '',
          fetal_heart_rate: 0
        } 
      });
    }
    
    res.json({ success: true, data: pregnancyData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all animal health data combined
router.get('/animals/:id/all-data', (req, res) => {
  try {
    const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ success: false, error: 'Animal not found' });
    }
    
    const healthData = db.prepare(`
      SELECT * FROM health_data 
      WHERE animal_id = ? 
      ORDER BY date ASC
    `).all(req.params.id);
    
    const pregnancyData = db.prepare(`
      SELECT * FROM pregnancy_data 
      WHERE animal_id = ?
    `).get(req.params.id);
    
    res.json({ 
      success: true, 
      data: {
        animal,
        healthData,
        pregnancyData: pregnancyData || {
          status: 'Unknown',
          gestation_days: 0,
          expected_due_date: '',
          last_checkup: '',
          fetal_heart_rate: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
