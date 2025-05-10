// server/routes/reportRoutes.js

import express from 'express';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import 'pdfkit-table';
import db from '../db/database.js'; // Adjust path to your DB module

const router = express.Router();

/**
 * Fetches filtered data for the given reportType and date range.
 * Extend this switch to handle 'productivity', 'mortality', 'compliance', etc.
 */
async function fetchReportData({ reportType, from, to, animalId }) {
  const params = [from, to];
  let sql = '';

  switch (reportType) {
    case 'health':
      sql = `
        SELECT date, animal_id, temperature, heart_rate, activity
        FROM health_data
        WHERE date BETWEEN ? AND ?
      `;
      break;

    // TODO: Add cases for 'productivity', 'mortality', 'compliance'
    default:
      throw new Error(`Unsupported reportType: ${reportType}`);
  }

  if (animalId) {
    sql += ' AND animal_id = ?';
    params.push(animalId);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
}

/**
 * GET /api/export
 * Query parameters:
 *   - format: 'csv' or 'pdf'
 *   - reportType: e.g. 'health'
 *   - from: YYYY-MM-DD
 *   - to:   YYYY-MM-DD
 *   - animalId: optional
 */
router.get('/export', async (req, res, next) => {
  try {
    const { format, reportType, from, to, animalId } = req.query;
    if (!format || !reportType || !from || !to) {
      return res.status(400).send('Missing required query parameters');
    }

    const dataRows = await fetchReportData({ reportType, from, to, animalId });

    if (format === 'csv') {
      const fields = Object.keys(dataRows[0] || {});
      const csv    = new Parser({ fields }).parse(dataRows);

      res.header('Content-Type', 'text/csv');
      res.attachment(`${reportType}-report.csv`);
      return res.send(csv);
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      res.header('Content-Type', 'application/pdf');
      res.attachment(`${reportType}-report.pdf`);
      doc.pipe(res);

      // Title
      doc
        .fontSize(18)
        .text(
          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
          { align: 'center' }
        );
      doc.moveDown();

      // Table
      const table = {
        headers: Object.keys(dataRows[0] || {}),
        rows: dataRows.map(row => Object.values(row))
      };
      // pdfkit-table attaches `.table(...)` to PDFDocument
      // eslint-disable-next-line no-await-in-loop
      await doc.table(table, { width: 500 });

      return doc.end();
    }

    return res.status(400).send('Invalid format');
  } catch (err) {
    return next(err);
  }
});

export default router;
