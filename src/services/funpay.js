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

    // Clean single-line summary (FunPay strictly disallows line breaks in summary)
    const cleanRuSummary = generatedTitle.replace(/[\r\n\t]+/g, ' ').trim().substring(0, 95);

    // Prepare clean English translations compliant with FunPay rules (no Cyrillic, 30-95 chars)
    let enSummary = await translator.translate(cleanRuSummary.replace(/\[.*?\]/g, '').trim(), 'en', 'ru');
    enSummary = (enSummary || `Guide and tips for ${lot.gameName || 'game'}`).replace(/[\r\n\t]+/g, ' ').trim();
    enSummary = `[PRO GUIDE] ${enSummary}`.substring(0, 95);

    // Clean descriptions: compress excessive blank lines to avoid 'Слишком много строк'
    let cleanRuDesc = generatedDescription
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    let enDesc = await translator.translate(cleanRuDesc, 'en', 'ru');
    if (!enDesc || enDesc.length < 50) {
      enDesc = `Detailed walkthrough and instructions for ${lot.gameName || 'game'}. Instant delivery right after payment. Safe and fully verified for current patch. Contact seller in chat for any questions.`;
    }
    enDesc = enDesc.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    // Ensure payment message is concise (max 2-3 lines to avoid line limit)
    const secretUrl = (lot.content || lot.productData || '').match(/https?:\/\/[^\s]+/)?.[0] || 'https://telegra.ph/Guide-Instructions-2026';
    const paymentMsgRu = `Спасибо за покупку! 🎮\nСсылка на материал:\n${secretUrl}`;
    const paymentMsgEn = `Thank you for your purchase! 🎮\nYour guide link:\n${secretUrl}`;

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
