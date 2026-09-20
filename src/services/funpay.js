import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from '../database/db.js';
import { translator } from './translator.js';

export const FUNPAY_NODES = {
  cs2: {
    template1_guides: { nodeId: 1351, name: 'Counter-Strike 2 (Прочее / Гайды)', url: 'https://funpay.com/lots/1351/' },
    template2_boost: { nodeId: 1908, name: 'Counter-Strike 2 (Обучение)', url: 'https://funpay.com/lots/1908/' },
    template3_free: { nodeId: 1351, name: 'Counter-Strike 2 (Прочее)', url: 'https://funpay.com/lots/1351/' }
  },
  dota2: {
    template1_guides: { nodeId: 504, name: 'Dota 2 (Прочее / Гайды)', url: 'https://funpay.com/lots/504/' },
    template2_boost: { nodeId: 502, name: 'Dota 2 (Обучение)', url: 'https://funpay.com/lots/502/' },
    template3_free: { nodeId: 504, name: 'Dota 2 (Прочее)', url: 'https://funpay.com/lots/504/' }
  },
  valorant: {
    template1_guides: { nodeId: 613, name: 'Valorant (Прочее / Гайды)', url: 'https://funpay.com/lots/613/' },
    template2_boost: { nodeId: 666, name: 'Valorant (Обучение)', url: 'https://funpay.com/lots/666/' },
    template3_free: { nodeId: 613, name: 'Valorant (Прочее)', url: 'https://funpay.com/lots/613/' }
  },
  gta5: {
    template1_guides: { nodeId: 879, name: 'GTA 5 Online (Прочее / Гайды)', url: 'https://funpay.com/lots/879/' },
    template2_boost: { nodeId: 88, name: 'GTA 5 Online (Услуги)', url: 'https://funpay.com/lots/88/' },
    template3_free: { nodeId: 879, name: 'GTA 5 Online (Прочее)', url: 'https://funpay.com/lots/879/' }
  },
  rust: {
    template1_guides: { nodeId: 888, name: 'Rust (Прочее / Гайды)', url: 'https://funpay.com/lots/888/' },
    template2_boost: { nodeId: 252, name: 'Rust (Услуги)', url: 'https://funpay.com/lots/252/' },
    template3_free: { nodeId: 888, name: 'Rust (Прочее)', url: 'https://funpay.com/lots/888/' }
  },
  genshin: {
    template1_guides: { nodeId: 1107, name: 'Genshin Impact (Прочее / Гайды)', url: 'https://funpay.com/lots/1107/' },
    template2_boost: { nodeId: 697, name: 'Genshin Impact (Прокачка)', url: 'https://funpay.com/lots/697/' },
    template3_free: { nodeId: 1107, name: 'Genshin Impact (Прочее)', url: 'https://funpay.com/lots/1107/' }
  },
  tarkov: {
    template1_guides: { nodeId: 644, name: 'Escape from Tarkov (Прочее / Гайды)', url: 'https://funpay.com/lots/644/' },
    template2_boost: { nodeId: 1204, name: 'Escape from Tarkov (Обучение)', url: 'https://funpay.com/lots/1204/' },
    template3_free: { nodeId: 644, name: 'Escape from Tarkov (Прочее)', url: 'https://funpay.com/lots/644/' }
  },
  minecraft: {
    template1_guides: { nodeId: 2054, name: 'Minecraft (Гайды)', url: 'https://funpay.com/lots/2054/' },
    template2_boost: { nodeId: 223, name: 'Minecraft (Услуги)', url: 'https://funpay.com/lots/223/' },
    template3_free: { nodeId: 1754, name: 'Minecraft (Конфиги)', url: 'https://funpay.com/lots/1754/' }
  },
  roblox: {
    template1_guides: { nodeId: 402, name: 'Roblox (Прочие игры / Гайды)', url: 'https://funpay.com/lots/402/' },
    template2_boost: { nodeId: 402, name: 'Roblox (Услуги)', url: 'https://funpay.com/lots/402/' },
    template3_free: { nodeId: 402, name: 'Roblox (Прочее)', url: 'https://funpay.com/lots/402/' }
  },
  steam: {
    template1_guides: { nodeId: 1009, name: 'Steam (Услуги / Гайды)', url: 'https://funpay.com/lots/1009/' },
    template2_boost: { nodeId: 1009, name: 'Steam (Услуги)', url: 'https://funpay.com/lots/1009/' },
    template3_free: { nodeId: 2044, name: 'Steam (Смена региона)', url: 'https://funpay.com/lots/2044/' }
  },
  telegram: {
    template1_guides: { nodeId: 1392, name: 'Telegram (Прочее / Гайды)', url: 'https://funpay.com/lots/1392/' },
    template2_boost: { nodeId: 703, name: 'Telegram (Услуги)', url: 'https://funpay.com/lots/703/' },
    template3_free: { nodeId: 1391, name: 'Telegram (Premium)', url: 'https://funpay.com/lots/1391/' }
  }
};

export const COMPLIANT_LOT_CONTENT = {
  lot_cs2_grenades: {
    summaryRu: '🎯 Полный гайд по раскидкам CS2 (Все соревновательные карты)',
    summaryEn: '[PRO GUIDE] CS2 Full Grenades Lineups & Smokes (All Maps)',
    descRu: 'Актуальный интерактивный сборник смоков, флешек и молотовых для соревновательного пула CS2.\nВключает консольные бинды для тренировки.\nБыстрая передача товара лично продавцом в чате заказа!',
    descEn: 'Complete interactive guide for CS2 smokes, flashes and molotovs on all competitive maps.\nIncludes practice console binds and pro lineups.\nFast personal delivery by seller directly in chat.'
  },
  lot_cs2_config_pro: {
    summaryRu: '⚡ PRO Конфиг CS2 + Оптимизация FPS (Input Lag 0ms) 2026',
    summaryEn: '[PRO CONFIG] CS2 Autoexec Config & FPS Boost (0ms Input Lag)',
    descRu: 'Киберспортивный autoexec.cfg с лучшими рейтами саб-тика и параметрами запуска Steam.\nУбирает фризы и повышает плавность стрельбы.\nБыстрая передача товара лично продавцом в чате!',
    descEn: 'Tier-1 competitive autoexec.cfg with optimal sub-tick network rates and launch options.\nEliminates stutters and maximizes FPS.\nFast manual delivery in chat.'
  },
  lot_cs2_coaching: {
    summaryRu: '🏆 Индивидуальное обучение CS2 от игрока 3000+ ELO Faceit',
    summaryEn: '[COACHING] CS2 1-on-1 Coaching & Demo Analysis (3000+ ELO)',
    descRu: 'Персональный разбор вашей демки, позиционирования, таймингов и стрельбы.\nЧек-лист ошибок и карта тренировки аима.\nНапишите в чат после оплаты для согласования времени!',
    descEn: 'Personal demo review, crosshair placement and positioning training from 3000+ ELO player.\n30-day aim training schedule.\nContact seller in chat to begin.'
  },
  lot_dota2_mmr_guide: {
    summaryRu: '🏆 Гайд: Как соло поднять с 1000 до 6000+ MMR в Dota 2',
    summaryEn: '[SOLO MMR] Dota 2 Guide: Road from 1000 to 6000+ MMR',
    descRu: 'Пошаговый план поднятия рейтинга в соло: пул метовых героев и тайминги макро-игры.\nКонтроль рун мудрости (7/14 мин) и Терзателя.\nБыстрая выдача продавцом в чате сразу после оплаты!',
    descEn: 'Step-by-step solo queue ranking guide with meta hero builds and macro timings.\nWisdom runes and tormentor control tips.\nFast delivery in chat.'
  },
  lot_dota2_micro_scripts: {
    summaryRu: '⚡ PRO Настройки Dota 2: Смарт-касты и Бинды микроконтроля',
    summaryEn: '[PRO SETTINGS] Dota 2 Settings, Smart Casts & Micro-Control',
    descRu: 'Конфигурация Quickcast, бинды отдаления камеры и управление суммонами (Meepo, Arc, Chen).\nПолная инструкция по настройке.\nБыстрая передача в чате заказа!',
    descEn: 'Complete quickcast setup, camera distance tweaks and micro-control binds for Meepo, Arc Warden & Chen.\nSafe and verified for 2026.\nFast delivery in chat.'
  },
  lot_val_aim_routine: {
    summaryRu: '🎯 Программа тренировки аима Valorant (AimLab + Range)',
    summaryEn: '[AIM ROUTINE] Valorant 20-Min Training (AimLab & Range)',
    descRu: 'Ежедневный 20-минутный комплекс для роста Headshot % и правильного контр-стрейфа.\nРасчет идеального eDPI.\nБыстрая передача продавцом в чате!',
    descEn: 'Structured daily aim workout to boost your headshot percentage.\nProper eDPI sensitivity setup and counter-strafing techniques.\nFast delivery in chat.'
  },
  lot_val_lineups: {
    summaryRu: '🏹 Все Лайнапы Valorant (Sova, Viper, Killjoy, Brimstone)',
    summaryEn: '[LINEUPS] Valorant Lineups Guide (Sova, Viper, Killjoy)',
    descRu: 'Интерактивная база шок-стрел, молли и ловушек под дефьюз для всех соревновательных карт.\nТочные привязки к прицелу и интерфейсу.\nБыстрая выдача в чате заказа!',
    descEn: 'Full interactive lineup database for all competitive maps.\nShock darts, molly lineups and setups with exact HUD references.\nFast delivery in chat.'
  },
  lot_gta5_money_guide: {
    summaryRu: '💰 Гайд по фарму $5,000,000 в час в GTA Online (Соло)',
    summaryEn: '[CASH GUIDE] GTA 5 Online Solo Farm $5M/Hour (Cayo Perico)',
    descRu: 'Скоростное соло ограбление Cayo Perico за 7 минут + пассивный доход ночного клуба.\n100% легально без читов и риска бана.\nБыстрая передача продавцом в чате!',
    descEn: 'Solo Cayo Perico 7-minute stealth drainage tunnel route and nightclub passive income guide.\n100% legit and safe from ban.\nFast delivery in chat.'
  },
  lot_gta5_rp_starter: {
    summaryRu: '🚗 Шпаргалка правил и быстрый старт на серверах GTA 5 RP',
    summaryEn: '[RP GUIDE] GTA 5 RP Starter Guide & Rules Cheatsheet',
    descRu: 'Ответы на правила собеседований (DM, DB, PG, MG) и синтаксис отыгровок /me и /do во фракции.\nБыстрая передача продавцом в диалоге заказа!',
    descEn: 'Full answers for server whitelist interviews (DM, DB, PG, MG) and proper /me and /do syntax.\nTop early jobs and tips.\nFast delivery in chat.'
  },
  lot_rust_wipe_guide: {
    summaryRu: '🏕️ Гайд по старту в Rust после вайпа + Анти-рейд бункер',
    summaryEn: '[SURVIVAL] Rust Wipe Day Start Guide & 2x1 Bunker Base',
    descRu: 'Маршрут первых 15 минут от пляжа до переработчика + схема постройки бункера 2х1 с пиксель-гэпом.\nБыстрая передача продавцом в чате заказа!',
    descEn: 'Fast route from the beach to recycler and Tier-2 workbench.\nAnti-raid 2x1 bunker base blueprint with pixel gap defense.\nFast delivery in chat.'
  },
  lot_genshin_abyss_guide: {
    summaryRu: '⭐ Прохождение 12 этажа Витой Бездны на 36★ (F2P отряды)',
    summaryEn: '[36 STARS] Genshin Impact Spiral Abyss Floor 12 Guide',
    descRu: 'Бюджетные 4★ сборки (Националка, Гиперблум), ротации способностей и пороги статов.\nИнтерактивная карта ресурсов.\nБыстрая выдача в чате заказа!',
    descEn: 'Budget F2P team compositions (National, Hyperbloom), minimum stat thresholds and rotations.\nInteractive Teyvat resource map link.\nFast delivery in chat.'
  },
  lot_tarkov_loot_maps: {
    summaryRu: '🎒 Карты лута Escape from Tarkov + Таблица патронов',
    summaryEn: '[EFT MAPS] Escape from Tarkov Loot Maps & Ammo Ballistics',
    descRu: 'Интерактивные карты схронов и безопасных выходов со всех локаций Tarkov + баллистика текущего патча.\nБыстрая передача продавцом в чате!',
    descEn: 'Interactive 3D maps with cache locations, safe extracts and current patch ammo penetration tables.\nFast manual delivery in chat.'
  },
  lot_mc_auto_farms: {
    summaryRu: '⛏️ Сборник схем автоматических ферм Minecraft (1.20+)',
    summaryEn: '[FARMS] Minecraft Best Automatic Farm Blueprints (1.20+)',
    descRu: 'Чертежи компактной фермы железа (350+ слитков/час), золота и опыта + база схем Litematica.\nБыстрая выдача в чате заказа!',
    descEn: 'Compact iron farm (350+ ingots/hour), gold/XP farms and Litematica schematic resources.\nReliable and bug-free.\nFast delivery in chat.'
  },
  lot_roblox_trading: {
    summaryRu: '💎 Гайд по трейдингу и ценностям предметов в Roblox',
    summaryEn: '[TRADING] Roblox Trading & Value Lists (Blox Fruits, MM2)',
    descRu: 'Официальные таблицы ценностей (Value List) для Blox Fruits, Pet Simulator 99 и MM2.\nФормулы выгодного обмена.\nБыстрая передача продавцом в чате!',
    descEn: 'Official item value lists for Blox Fruits, Pet Simulator 99 and MM2.\nFair trade calculator guidelines and scam prevention.\nFast delivery in chat.'
  },
  lot_steam_region_guide: {
    summaryRu: '🌐 Безопасная смена региона Steam (Казахстан / Украина)',
    summaryEn: '[STEAM] Safe Region Change Tutorial (Kazakhstan/Turkey)',
    descRu: 'Пошаговый алгоритм смены страны без риска бана аккаунта и способы прямого пополнения кошелька.\nБыстрая передача продавцом в чате!',
    descEn: 'Step-by-step instructions to change Steam store region safely without account ban.\nDirect wallet top-up methods included.\nFast delivery in chat.'
  },
  lot_tg_premium_guide: {
    summaryRu: '⭐ Как выгодно подключить Telegram Premium и Stars (-50%)',
    summaryEn: '[TELEGRAM] Telegram Premium & Stars 50% Discount Guide',
    descRu: 'Официальный метод покупки подписки и звезд через платформу Fragment без наценки AppStore.\n100% легально.\nБыстрая выдача продавцом в чате!',
    descEn: 'Official method to purchase Telegram Premium and Stars via Fragment using TON cryptocurrency.\n100% safe and legal.\nFast delivery in chat.'
  }
};

export function getNodeForLot(lot) {
  const gameMap = FUNPAY_NODES[lot.gameId];
  if (gameMap) {
    return gameMap[lot.templateType] || gameMap.template1_guides || gameMap.template3_free;
  }
  return { nodeId: 1351, name: lot.gameName || 'Прочее', url: 'https://funpay.com/lots/1351/' };
}

export class FunPayClient {
  constructor() {
    this.baseUrl = 'https://funpay.com';
    this.goldenKey = '';
    this.cookieStore = '';
    this.user = null;
    this.csrfToken = '';
  }

  setGoldenKey(key) {
    this.goldenKey = (key || '').trim();
    this.cookieStore = `golden_key=${this.goldenKey}; cookie_test=1; locale=ru`;
    db.updateSettings({ goldenKey: this.goldenKey });
  }

  getHeaders(referer = 'https://funpay.com/') {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8',
      'Cookie': this.cookieStore || `golden_key=${this.goldenKey}; cookie_test=1; locale=ru`,
      'Referer': referer
    };
  }

  updateCookiesFromResponse(res) {
    const setCookies = res.headers['set-cookie'] || [];
    if (setCookies.length > 0) {
      setCookies.forEach(cookieStr => {
        const keyVal = cookieStr.split(';')[0].trim();
        const keyName = keyVal.split('=')[0];
        const regex = new RegExp(`${keyName}=[^;]+`, 'g');
        if (regex.test(this.cookieStore)) {
          this.cookieStore = this.cookieStore.replace(regex, keyVal);
        } else {
          this.cookieStore += `; ${keyVal}`;
        }
      });
    }
  }

  /**
   * Validate golden_key by scraping user profile page on FunPay and establishing session cookies
   */
  async checkAuth(key = null) {
    if (key) this.setGoldenKey(key);
    if (!this.goldenKey) {
      this.user = null;
      return { valid: false, message: 'golden_key не указан' };
    }

    try {
      db.addLog('info', 'Проверка токена golden_key на FunPay...');
      const response = await axios.get(this.baseUrl, {
        headers: this.getHeaders(),
        timeout: 12000
      });

      this.updateCookiesFromResponse(response);

      const html = response.data;
      const $ = cheerio.load(html);

      // Check if user is logged in
      const userLink = $('a.user-link-name, .navbar-user .user-link, a[href*="/users/"]');
      const logoutBtn = $('a[href*="/account/logout"]');

      if (!logoutBtn.length && !userLink.length) {
        db.addLog('warning', 'golden_key недействителен или истек (FunPay вернул страницу гостя)');
        this.user = null;
        return {
          valid: false,
          message: 'golden_key недействителен или истек. Скопируйте свежий токен из куки funpay.com'
        };
      }

      // Parse user details
      const userName = userLink.first().text().trim().replace(/Профиль/g, '').trim() || 'FunPay Seller';
      const userHref = userLink.first().attr('href') || '';
      const userIdMatch = userHref.match(/\/users\/(\d+)\//);
      const userId = userIdMatch ? userIdMatch[1] : 'unknown';

      // Parse balance
      const balanceEl = $('.badge-balance, .user-link-balance, .balance-total');
      const balance = balanceEl.text().trim() || '0 ₽';

      // Parse avatar
      const avatarEl = $('.user-link-photo, .navbar-user img');
      const avatarUrl = avatarEl.attr('src') || 'https://funpay.com/img/layout/avatar.png';

      // Extract CSRF
      const csrf = $('input[name="csrf_token"]').val() || $('body').attr('data-csrf');
      if (csrf) this.csrfToken = csrf;

      this.user = {
        id: userId,
        username: userName,
        balance: balance,
        avatar: avatarUrl,
        profileUrl: `https://funpay.com/users/${userId}/`,
        lastChecked: new Date().toISOString()
      };

      db.addLog('success', `✅ Авторизация FunPay успешна: ${userName} (ID: ${userId}) | Баланс: ${balance}`);
      return {
        valid: true,
        user: this.user
      };
    } catch (err) {
      db.addLog('error', `Ошибка подключения к FunPay: ${err.message}`);
      return {
        valid: false,
        message: `Ошибка запроса к FunPay: ${err.message}`
      };
    }
  }

  /**
   * Publish real offer on FunPay with session management, valid English translations and exact node mapping
   */
  async publishOfferToFunPay(lot, generatedTitle, generatedDescription, price) {
    if (!this.goldenKey) {
      throw new Error('golden_key не настроен в настройках');
    }

    const nodeInfo = getNodeForLot(lot);
    const nodeId = nodeInfo.nodeId;

    db.addLog('info', `📡 Подготовка публикации в раздел: ${nodeInfo.name} (Node ID: ${nodeId})...`);

    // Ensure session is initialized
    if (!this.cookieStore.includes('PHPSESSID')) {
      await this.checkAuth();
    }

    // 1. GET offerEdit page to obtain fresh CSRF, form_created_at, and available select values
    const editRes = await axios.get(`${this.baseUrl}/lots/offerEdit?node=${nodeId}`, {
      headers: this.getHeaders('https://funpay.com/'),
      timeout: 12000
    });

    this.updateCookiesFromResponse(editRes);

    const $ = cheerio.load(editRes.data);
    const csrf = $('input[name="csrf_token"]').val() || this.csrfToken;
    const formCreatedAt = $('input[name="form_created_at"]').val() || Math.floor(Date.now() / 1000).toString();

    // Collect valid select options from the form
    const formSelects = {};
    $('select').each((_, el) => {
      const name = $(el).attr('name');
      const options = $(el).find('option').map((_, opt) => $(opt).attr('value')).get().filter(v => v !== '');
      
      if (name && options.length > 0) {
        // Smart matching for 'fields[type]'
        if (name === 'fields[type]') {
          const guideOpt = options.find(o => /гайд/i.test(o) || /прочее/i.test(o) || /обучение/i.test(o));
          formSelects[name] = guideOpt || options[0];
        } else {
          formSelects[name] = options[0];
        }
      }
    });

    // 1. Get compliant content for current lot
    const preset = COMPLIANT_LOT_CONTENT[lot.id] || {};

    // 2. Ru Summary: single line, strictly <= 90 chars
    let cleanRuSummary = (generatedTitle || preset.summaryRu || lot.title)
      .replace(/[\r\n\t]+/g, ' ')
      .trim();
    if (cleanRuSummary.length > 90) {
      cleanRuSummary = cleanRuSummary.substring(0, 87) + '...';
    }

    // 3. En Summary: 100% pure Latin English, <= 90 chars, NO Cyrillic letters
    let enSummary = preset.summaryEn || `[PRO GUIDE] ${lot.gameName || 'Game'} Complete Guide & Tips 2026`;
    enSummary = enSummary.replace(/[\r\n\t]+/g, ' ').replace(/[^\x00-\x7F]/g, '').trim().substring(0, 90);

    // 4. Ru Desc: 2-3 concise lines max
    let cleanRuDesc = preset.descRu || generatedDescription || lot.description;
    cleanRuDesc = cleanRuDesc.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    // 5. En Desc: 2-3 concise lines, 100% pure Latin English, NO Cyrillic letters
    let enDesc = preset.descEn || `Comprehensive guide and tutorial for ${lot.gameName || 'this game'}.\nFast delivery by seller directly in chat.\n100% safe and verified.`;
    enDesc = enDesc.replace(/[^\x00-\x7F\n]/g, '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    // 6. Payment Message: friendly, no external links
    const paymentMsgRu = `Спасибо за заказ! 🎮\nПродавец уже на связи и передаст ваш товар прямо в этот чат в течение пары минут. Ожидайте!`;
    const paymentMsgEn = `Thank you for your order! 🎮\nThe seller is online and will deliver your materials directly in this chat shortly. Please wait!`;

    // 3. Build POST parameters matching FunPay's offerSave endpoint
    const params = new URLSearchParams();
    params.append('csrf_token', csrf);
    params.append('form_created_at', formCreatedAt);
    params.append('offer_id', '0');
    params.append('node_id', nodeId.toString());
    params.append('location', '');
    params.append('deleted', '');

    // Append auto-selected dropdown values
    for (const [k, v] of Object.entries(formSelects)) {
      params.append(k, v);
    }

    params.append('fields[summary][ru]', cleanRuSummary);
    params.append('fields[summary][en]', enSummary);
    params.append('fields[desc][ru]', cleanRuDesc);
    params.append('fields[desc][en]', enDesc);
    params.append('fields[payment_msg][ru]', paymentMsgRu);
    params.append('fields[payment_msg][en]', paymentMsgEn);
    params.append('price', price.toString());
    params.append('amount', '1');
    params.append('active', 'on');

    db.addLog('info', `🚀 Отправка формы на FunPay (раздел: ${nodeInfo.name})...`);

    const saveRes = await axios.post(`${this.baseUrl}/lots/offerSave`, params.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://funpay.com',
        'Referer': `${this.baseUrl}/lots/offerEdit?node=${nodeId}`,
        'Cookie': this.cookieStore
      },
      timeout: 15000
    });

    this.updateCookiesFromResponse(saveRes);
    const data = saveRes.data;

    if (data && data.done === false) {
      const errorMsg = data.errors ? data.errors.map(e => e[1]).join('; ') : (data.error || 'Ошибка FunPay');
      db.addLog('error', `❌ FunPay отклонил публикацию: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Determine actual lot / trade URL
    let lotUrl = `${nodeInfo.url}trade`;
    if (data && data.url) {
      lotUrl = data.url.startsWith('http') ? data.url : `https://funpay.com${data.url}`;
    }

    const offerIdMatch = lotUrl.match(/id=(\d+)/) || lotUrl.match(/offer=(\d+)/);
    const offerId = offerIdMatch ? offerIdMatch[1] : ('fp_' + Math.floor(1000000 + Math.random() * 9000000));

    db.addLog('success', `🎉 Лот успешно выставлен на FunPay в раздел "${nodeInfo.name}"!`);
    db.addLog('success', `🔗 Ссылка на лот: ${lotUrl}`);

    return {
      success: true,
      offerId: offerId,
      lotUrl: lotUrl,
      categoryUrl: nodeInfo.url,
      profileUrl: this.user ? `https://funpay.com/users/${this.user.id}/` : nodeInfo.url,
      gameName: nodeInfo.name
    };
  }

  /**
   * Raise (bump) lots on FunPay
   */
  async raiseLots(nodeId = '', gameId = null) {
    if (!this.goldenKey) {
      throw new Error('golden_key не настроен');
    }

    try {
      db.addLog('info', `Запрос на автоподнятие лотов на FunPay...`);
      const response = await axios.post(`${this.baseUrl}/lots/raise`, 
        new URLSearchParams({
          game_id: gameId || '',
          node_id: nodeId || ''
        }),
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 10000
        }
      );

      this.updateCookiesFromResponse(response);
      db.incrementBumpStat();
      db.addLog('success', `Лоты успешно подняты на FunPay! Статус: ${response.data?.msg || 'OK'}`);
      return response.data;
    } catch (err) {
      db.addLog('warning', `Авто-поднятие FunPay: ${err.response?.data?.msg || err.message}`);
      return { success: false, error: err.message };
    }
  }
}

export const funpay = new FunPayClient();
export default funpay;
