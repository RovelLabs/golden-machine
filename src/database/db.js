import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultLots, defaultTemplates } from './seed-lots.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'golden_machine_db.json');

class Database {
  constructor() {
    this.data = {
      settings: {
        goldenKey: '',
        autoBumpEnabled: true,
        autoBumpIntervalMinutes: 120, // 2 hours
        autoListEnabled: false,
        listingDelayMinSeconds: 15,
        listingDelayMaxSeconds: 45,
        translateToEnglish: true,
        includeBothLanguages: true,
        autoMessageEnabled: true,
        antiBanSafeMode: true
      },
      templates: defaultTemplates,
      lots: defaultLots,
      listedLots: [],
      logs: [],
      stats: {
        totalListed: 0,
        totalBumps: 0,
        totalMessagesSent: 0,
        lastBumpTime: null,
        lastListedTime: null
      }
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed,
          settings: { ...this.data.settings, ...(parsed.settings || {}) },
          templates: { ...this.data.templates, ...(parsed.templates || {}) },
          stats: { ...this.data.stats, ...(parsed.stats || {}) },
          lots: (parsed.lots && parsed.lots.length > 0) ? parsed.lots : defaultLots
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('[DB] Error initializing database:', err.message);
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error saving database:', err.message);
    }
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  getTemplates() {
    return this.data.templates;
  }

  updateTemplates(newTemplates) {
    this.data.templates = { ...this.data.templates, ...newTemplates };
    this.save();
    return this.data.templates;
  }

  getLots(filter = {}) {
    let result = [...this.data.lots];
    if (filter.category) {
      result = result.filter(lot => lot.templateType === filter.category);
    }
    if (filter.game) {
      result = result.filter(lot => lot.gameId === filter.game);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(lot => 
        lot.title.toLowerCase().includes(q) || 
        lot.gameName.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getLotById(id) {
    return this.data.lots.find(l => l.id === id);
  }

  addLot(lot) {
    const newLot = {
      id: 'lot_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      ...lot
    };
    this.data.lots.unshift(newLot);
    this.save();
    return newLot;
  }

  updateLot(id, updatedFields) {
    const idx = this.data.lots.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.data.lots[idx] = { ...this.data.lots[idx], ...updatedFields, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.lots[idx];
    }
    return null;
  }

  deleteLot(id) {
    const idx = this.data.lots.findIndex(l => l.id === id);
    if (idx !== -1) {
      const removed = this.data.lots.splice(idx, 1);
      this.save();
      return removed[0];
    }
    return null;
  }

  getListedLots() {
    return this.data.listedLots;
  }

  addListedLot(lot) {
    this.data.listedLots.unshift({
      ...lot,
      listedAt: new Date().toISOString()
    });
    this.data.stats.totalListed++;
    this.data.stats.lastListedTime = new Date().toISOString();
    this.save();
  }

  updateListedLot(id, fields) {
    const item = this.data.listedLots.find(l => l.id === id || l.funpayOfferId === id);
    if (item) {
      Object.assign(item, fields);
      this.save();
    }
  }

  addLog(level, message, meta = null) {
    const logItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      level, // 'info', 'success', 'warning', 'error'
      message,
      meta
    };
    this.data.logs.unshift(logItem);
    if (this.data.logs.length > 500) {
      this.data.logs = this.data.logs.slice(0, 500);
    }
    this.save();
    return logItem;
  }

  getLogs(limit = 100) {
    return this.data.logs.slice(0, limit);
  }

  getStats() {
    return {
      ...this.data.stats,
      totalDatabaseLots: this.data.lots.length,
      activeListedLots: this.data.listedLots.filter(l => l.status === 'active').length
    };
  }

  incrementBumpStat() {
    this.data.stats.totalBumps++;
    this.data.stats.lastBumpTime = new Date().toISOString();
    this.save();
  }

  incrementMessageStat() {
    this.data.stats.totalMessagesSent++;
    this.save();
  }
}

export const db = new Database();
export default db;
