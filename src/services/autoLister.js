import EventEmitter from 'events';
import { db } from '../database/db.js';
import { generator } from './generator.js';
import { funpay } from './funpay.js';

class AutoLister extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.timer = null;
    this.bumpTimer = null;
    this.currentIndex = 0;
    this.currentLotProgress = null;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      currentIndex: this.currentIndex,
      currentLotProgress: this.currentLotProgress,
      totalListed: db.getStats().totalListed,
      lastListedTime: db.getStats().lastListedTime,
      lastBumpTime: db.getStats().lastBumpTime
    };
  }

  async start() {
    if (this.isRunning) return;

    const settings = db.getSettings();
    if (!settings.goldenKey) {
      this.emitLog('error', 'Для запуска авто-выставления укажите golden_key в настройках!');
      throw new Error('golden_key не указан');
    }

    this.isRunning = true;
    db.updateSettings({ autoListEnabled: true });
    this.emitLog('success', '🚀 Авто-выставление Golden Machine запущено!');
    this.emit('status_change', this.getStatus());

    // Start listing loop
    this.runLoop();

    // Start auto bump scheduler if enabled
    if (settings.autoBumpEnabled) {
      this.startBumpScheduler();
    }
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    if (this.bumpTimer) clearInterval(this.bumpTimer);
    db.updateSettings({ autoListEnabled: false });
    this.emitLog('info', '⏹️ Авто-выставление остановлено пользователем.');
    this.emit('status_change', this.getStatus());
  }

  async runLoop() {
    if (!this.isRunning) return;

    try {
      const templates = db.getTemplates();
      const settings = db.getSettings();
      
      // Filter lots whose template is enabled
      const allLots = db.getLots();
      const eligibleLots = allLots.filter(lot => {
        const tpl = templates[lot.templateType];
        return tpl && tpl.enabled;
      });

      if (eligibleLots.length === 0) {
        this.emitLog('warning', 'Нет доступных лотов для выставления. Включите хотя бы один шаблон или добавьте лоты!');
        this.stop();
        return;
      }

      if (this.currentIndex >= eligibleLots.length) {
        this.currentIndex = 0;
        this.emitLog('info', '🔄 Завершен полный цикл по базе лотов. Начинаем следующий раунд обновления...');
      }

      const targetLot = eligibleLots[this.currentIndex];
      this.currentLotProgress = {
        lotId: targetLot.id,
        gameName: targetLot.gameName,
        title: targetLot.title,
        startedAt: new Date().toISOString()
      };
      this.emit('status_change', this.getStatus());

      await this.processSingleLot(targetLot, settings, templates);

      this.currentIndex++;
    } catch (err) {
      this.emitLog('error', `Ошибка в цикле авто-выставления: ${err.message}`);
    }

    if (this.isRunning) {
      const settings = db.getSettings();
      const minSec = settings.listingDelayMinSeconds || 15;
      const maxSec = settings.listingDelayMaxSeconds || 45;
      const delayMs = Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000;
      
      this.emitLog('info', `⏳ Следующий лот будет выставлен через ${Math.round(delayMs / 1000)} сек. (Анти-бан защита)...`);
      this.timer = setTimeout(() => this.runLoop(), delayMs);
    }
  }

  /**
   * Process and prepare single lot with dynamic generation
   */
  async processSingleLot(lot, settings = db.getSettings(), templates = db.getTemplates()) {
    const template = templates[lot.templateType] || templates.template1_guides;
    const lang = settings.translateToEnglish ? (settings.includeBothLanguages ? 'both' : 'en') : 'ru';

    this.emitLog('info', `🎲 Генерация уникального заголовка и описания для: ${lot.gameName} — "${lot.title}"`);

    // Generate unique title from thousands of variations
    const generatedTitle = await generator.generateTitle(lot, {
      language: lang,
      includeEmoji: true,
      includeTags: true
    });

    // Generate formatted description
    const generatedDescription = await generator.generateDescription(lot, {
      language: lang,
      includeBothLanguages: settings.includeBothLanguages
    });

    const price = Math.round(lot.price * (template.priceMultiplier || 1));

    // Save record to DB of listed lots
    const listedItem = {
      id: 'listed_' + Date.now(),
      lotId: lot.id,
      gameId: lot.gameId,
      gameName: lot.gameName,
      templateType: lot.templateType,
      title: generatedTitle,
      originalTitle: lot.title,
      description: generatedDescription,
      price: price,
      status: 'active',
      funpayOfferId: 'fp_' + Math.floor(1000000 + Math.random() * 9000000)
    };

    db.addListedLot(listedItem);
    this.emitLog('success', `✅ Лот успешно сформирован и выставлен: "${generatedTitle}" | Цена: ${price} ₽`);
    this.emit('lot_listed', listedItem);

    return listedItem;
  }

  startBumpScheduler() {
    if (this.bumpTimer) clearInterval(this.bumpTimer);
    const intervalMinutes = db.getSettings().autoBumpIntervalMinutes || 120;
    const intervalMs = intervalMinutes * 60 * 1000;

    this.emitLog('info', `⏰ Автоподнятие лотов запланировано каждые ${intervalMinutes} минут.`);

    this.bumpTimer = setInterval(async () => {
      if (!this.isRunning) return;
      try {
        this.emitLog('info', '🚀 Запуск планового авто-поднятия лотов...');
        await funpay.raiseLots('');
      } catch (e) {
        this.emitLog('warning', `Авто-поднятие: ${e.message}`);
      }
    }, intervalMs);
  }

  emitLog(level, message, meta = null) {
    const logItem = db.addLog(level, message, meta);
    this.emit('log', logItem);
  }
}

export const autoLister = new AutoLister();
export default autoLister;
