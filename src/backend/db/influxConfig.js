import { InfluxDB, Point } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables or use defaults
dotenv.config();

// Connection params
const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
const token = process.env.INFLUXDB_TOKEN || 'my-super-secret-auth-token';
const org = process.env.INFLUXDB_ORG || 'farmpulse';
const bucket = process.env.INFLUXDB_BUCKET || 'iot_sensors';

// Create client
const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket, 'ns');
const queryApi = influxDB.getQueryApi(org);

export {
  influxDB,
  writeApi,
  queryApi,
  Point,
  org,
  bucket
};
