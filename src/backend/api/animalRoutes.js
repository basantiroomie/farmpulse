import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

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
          fetal_heart_rate: 0,
          notes: ''
        } 
      });
    }
    
    res.json({ success: true, data: pregnancyData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get pregnancy stats for an animal (detailed daily data)
router.get('/animals/:id/pregnancy-stats', (req, res) => {
  try {
    const pregnancyStats = db.prepare(`
      SELECT * FROM pregnancy_stats 
      WHERE animal_id = ? 
      ORDER BY date ASC
    `).all(req.params.id);
    
    res.json({ success: true, data: pregnancyStats });
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
    
    const pregnancyStats = db.prepare(`
      SELECT * FROM pregnancy_stats 
      WHERE animal_id = ? 
      ORDER BY date ASC
    `).all(req.params.id);
    
    res.json({ 
      success: true, 
      data: {
        animal,
        healthData,
        pregnancyData: pregnancyData || {
          animal_id: req.params.id,
          status: 'Unknown',
          gestation_days: 0,
          expected_due_date: '',
          last_checkup: '',
          fetal_heart_rate: 0,
          notes: ''
        },
        pregnancyStats: pregnancyStats || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;