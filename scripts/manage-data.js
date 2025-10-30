#!/usr/bin/env node

/**
 * Data Management Script for Banking Dashboard
 * 
 * Usage:
 *   node scripts/manage-data.js backup     - Create a backup of current data
 *   node scripts/manage-data.js restore    - Restore from latest backup
 *   node scripts/manage-data.js view       - View current data
 *   node scripts/manage-data.js reset      - Reset to default data
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/banking-data.json');
const BACKUP_DIR = path.join(__dirname, '../data/backups');

// Default data
const DEFAULT_DATA = {
  "data": {
    "Pinjaman": {
      "current": 45000000,
      "target": 50000000,
      "previousDay": 44500000,
      "previousMonth": 41500000,
      "previousYear": 38900000,
      "segments": [
        { "name": "Micro", "value": 12000000, "target": 15000000 },
        { "name": "Small", "value": 18000000, "target": 20000000 },
        { "name": "Consumer", "value": 15000000, "target": 15000000 }
      ]
    },
    "SML": {
      "current": 8500000,
      "target": 10000000,
      "previousDay": 8600000,
      "previousMonth": 8900000,
      "previousYear": 9700000,
      "segments": [
        { "name": "Micro", "value": 3000000, "target": 3500000 },
        { "name": "Small", "value": 3500000, "target": 4000000 },
        { "name": "Consumer", "value": 2000000, "target": 2500000 }
      ]
    },
    "NPL": {
      "current": 2100000,
      "target": 1500000,
      "previousDay": 2150000,
      "previousMonth": 2320000,
      "previousYear": 2450000,
      "segments": [
        { "name": "Micro", "value": 600000, "target": 400000 },
        { "name": "Small", "value": 800000, "target": 600000 },
        { "name": "Consumer", "value": 700000, "target": 500000 }
      ]
    },
    "Recovery": {
      "current": 3200000,
      "target": 3500000,
      "previousDay": 3100000,
      "previousMonth": 2920000,
      "previousYear": 2700000,
      "segments": [
        { "name": "Micro", "value": 1000000, "target": 1100000 },
        { "name": "Small", "value": 1200000, "target": 1300000 },
        { "name": "Consumer", "value": 1000000, "target": 1100000 }
      ]
    },
    "Dana Pihak Ketiga": {
      "current": 125000000,
      "target": 130000000,
      "previousDay": 123000000,
      "previousMonth": 117800000,
      "previousYear": 109300000,
      "segments": [
        { "name": "Micro - Checking", "value": 20000000, "target": 22000000 },
        { "name": "Micro - Deposits", "value": 18000000, "target": 19000000 },
        { "name": "Micro - Savings", "value": 15000000, "target": 16000000 },
        { "name": "Small - Checking", "value": 25000000, "target": 26000000 },
        { "name": "Small - Deposits", "value": 28000000, "target": 29000000 },
        { "name": "Small - Savings", "value": 19000000, "target": 18000000 }
      ]
    }
  },
  "lastUpdated": new Date().toISOString()
};

// Ensure directories exist
function ensureDirectories() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

// Backup current data
function backup() {
  ensureDirectories();
  
  if (!fs.existsSync(DATA_FILE)) {
    console.log('❌ No data file to backup');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `banking-data-${timestamp}.json`);
  
  fs.copyFileSync(DATA_FILE, backupFile);
  console.log(`✅ Backup created: ${backupFile}`);
}

// Restore from latest backup
function restore() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('❌ No backups directory found');
    return;
  }

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('banking-data-'))
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.log('❌ No backups found');
    return;
  }

  const latestBackup = path.join(BACKUP_DIR, backups[0]);
  fs.copyFileSync(latestBackup, DATA_FILE);
  console.log(`✅ Restored from: ${latestBackup}`);
}

// View current data
function view() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('❌ No data file found');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log('📊 Current Banking Data:');
  console.log(JSON.stringify(data, null, 2));
}

// Reset to default data
function reset() {
  ensureDirectories();
  
  // Backup current data if it exists
  if (fs.existsSync(DATA_FILE)) {
    backup();
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
  console.log('✅ Data reset to defaults');
}

// Main
const command = process.argv[2];

switch (command) {
  case 'backup':
    backup();
    break;
  case 'restore':
    restore();
    break;
  case 'view':
    view();
    break;
  case 'reset':
    reset();
    break;
  default:
    console.log(`
Banking Dashboard Data Management

Usage:
  node scripts/manage-data.js <command>

Commands:
  backup   - Create a backup of current data
  restore  - Restore from latest backup
  view     - View current data
  reset    - Reset to default data

Examples:
  node scripts/manage-data.js backup
  node scripts/manage-data.js view
    `);
}
