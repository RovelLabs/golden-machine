import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

import { db } from './database/db.js';
import { funpay } from './services/funpay.js';
import { generator } from './services/generator.js';
import { translator } from './services/translator.js';
import { autoLister } from './services/autoLister.js';
import { autoMessenger } from './services/autoMessenger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../public')));

// Broadcast helper for WebSockets
function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Hook up AutoLister events to WebSocket broadcasts
autoLister.on('log', (logItem) => broadcast('log', logItem));
autoLister.on('status_change', (status) => broadcast('status_change', status));
autoLister.on('lot_listed', (lot) => broadcast('lot_listed', lot));

// WebSocket connection handling
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    type: 'init',
    payload: {
      status: autoLister.getStatus(),
      settings: db.getSettings(),
      stats: db.getStats(),
      user: funpay.user
    }
  }));
});

// ==================== API ROUTES ====================

// Status and Overview
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    botStatus: autoLister.getStatus(),
    stats: db.getStats(),
    settings: db.getSettings(),
    user: funpay.user
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: db.getSettings() });
});

app.post('/api/settings', async (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    if (req.body.goldenKey && req.body.goldenKey !== funpay.goldenKey) {
      funpay.setGoldenKey(req.body.goldenKey);
      await funpay.checkAuth();
    }
    broadcast('settings_updated', updated);
    res.json({ success: true, settings: updated, user: funpay.user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// FunPay Auth Check
app.post('/api/funpay/auth', async (req, res) => {
  const { goldenKey } = req.body;
  if (goldenKey) {
    funpay.setGoldenKey(goldenKey);
  }
  const result = await funpay.checkAuth();
  broadcast('auth_status', result);
  res.json({ success: result.valid, ...result });
});

// Bump Lots
app.post('/api/funpay/bump', async (req, res) => {
  try {
    const result = await funpay.raiseLots(req.body.nodeId || '');
    broadcast('stats_updated', db.getStats());
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Database Lots
app.get('/api/database/lots', (req, res) => {
  const lots = db.getLots(req.query);
  res.json({ success: true, count: lots.length, lots });
});

app.post('/api/database/lots', (req, res) => {
  try {
    const newLot = db.addLot(req.body);
    db.addLog('info', `Добавлен новый лот в базу: "${newLot.title}"`);
    res.json({ success: true, lot: newLot });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/database/lots/:id', (req, res) => {
  try {
    const updated = db.updateLot(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Лот не найден' });
    res.json({ success: true, lot: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/database/lots/:id', (req, res) => {
  try {
    const removed = db.deleteLot(req.params.id);
    if (!removed) return res.status(404).json({ success: false, error: 'Лот не найден' });
    db.addLog('info', `Лот удален из базы: "${removed.title}"`);
    res.json({ success: true, lot: removed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Templates
app.get('/api/templates', (req, res) => {
  res.json({ success: true, templates: db.getTemplates() });
});

app.post('/api/templates', (req, res) => {
  try {
    const updated = db.updateTemplates(req.body);
    db.addLog('info', 'Шаблоны авто-выставления обновлены');
    broadcast('templates_updated', updated);
    res.json({ success: true, templates: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generator Preview & Testing
app.post('/api/generator/preview', async (req, res) => {
  try {
    const { lotId, customLot, options = {} } = req.body;
    const lot = customLot || db.getLotById(lotId) || db.getLots()[0];
    
    if (!lot) {
      return res.status(400).json({ success: false, error: 'Лот не указан' });
    }

    const templates = db.getTemplates();
    const template = templates[lot.templateType] || templates.template1_guides;

    const titles = [];
    for (let i = 0; i < 5; i++) {
      const t = await generator.generateTitle(lot, options);
      titles.push(t);
    }

    const description = await generator.generateDescription(lot, options);
    const buyerMessage = await autoMessenger.formatMessage(lot, template, {
      orderId: 'FP-' + Math.floor(100000 + Math.random() * 900000),
      buyerUsername: 'TestBuyer_2026'
    });

    const combinationsCount = generator.getCombinationsCount(lot);

    res.json({
      success: true,
      lot,
      titles,
      description,
      buyerMessage,
      combinationsCount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Translator API
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang = 'en', sourceLang = 'ru' } = req.body;
    const translated = await translator.translate(text, targetLang, sourceLang);
    res.json({ success: true, original: text, translated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AutoLister Controls
app.post('/api/autolister/start', async (req, res) => {
  try {
    await autoLister.start();
    res.json({ success: true, status: autoLister.getStatus() });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/autolister/stop', (req, res) => {
  autoLister.stop();
  res.json({ success: true, status: autoLister.getStatus() });
});

app.post('/api/autolister/publish-single', async (req, res) => {
  try {
    const { lotId } = req.body;
    const lot = db.getLotById(lotId);
    if (!lot) return res.status(404).json({ success: false, error: 'Лот не найден' });

    const listed = await autoLister.processSingleLot(lot);
    res.json({ success: true, listed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/listed-lots', (req, res) => {
  res.json({ success: true, listedLots: db.getListedLots() });
});

// Logs
app.get('/api/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json({ success: true, logs: db.getLogs(limit) });
});

// Test Order Simulation
app.post('/api/test-order', async (req, res) => {
  try {
    const { lotId } = req.body;
    const lot = db.getLotById(lotId) || db.getLots()[0];
    const orderResult = await autoMessenger.handleNewOrder({
      id: 'FP-' + Math.floor(100000 + Math.random() * 900000),
      lotId: lot ? lot.id : null,
      title: lot ? lot.title : 'Тестовый заказ',
      buyerUsername: 'GamerPro_' + Math.floor(100 + Math.random() * 900),
      templateType: lot ? lot.templateType : 'template1_guides'
    });
    broadcast('stats_updated', db.getStats());
    res.json({ success: true, order: orderResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server with auto-fallback to next port if in use
export function startServer(port = PORT) {
  return new Promise((resolve) => {
    const currentPort = parseInt(port) || 3000;
    
    server.listen(currentPort, () => {
      console.log(`\n======================================================`);
      console.log(`👑 GOLDEN MACHINE CORE SERVER RUNNING`);
      console.log(`🌐 Local Web Dashboard: http://localhost:${currentPort}`);
      console.log(`⚡ WebSocket Stream:    ws://localhost:${currentPort}`);
      console.log(`======================================================\n`);
      db.addLog('success', `Сервер Golden Machine запущен на порту ${currentPort}`);

      // Automatically check auth if golden_key already exists in db
      const settings = db.getSettings();
      if (settings.goldenKey) {
        funpay.setGoldenKey(settings.goldenKey);
        funpay.checkAuth().catch(() => {});
      }

      resolve({ server, port: currentPort });
    });

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`\x1b[33m[!] Порт ${currentPort} занят, автоматический переход на порт ${currentPort + 1}...\x1b[0m`);
        server.close();
        setTimeout(() => {
          resolve(startServer(currentPort + 1));
        }, 300);
      } else {
        console.error('\x1b[31m[-] Ошибка сервера:\x1b[0m', err);
      }
    });
  });
}

// Auto-start if run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer(PORT);
}

