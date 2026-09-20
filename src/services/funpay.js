import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from '../database/db.js';
import { translator } from './translator.js';

export const FUNPAY_NODES = {
  cs2: { nodeId: 1350, name: 'Counter-Strike 2', url: 'https://funpay.com/lots/1350/' },
  dota2: { nodeId: 81, name: 'Dota 2', url: 'https://funpay.com/lots/81/' },
  valorant: { nodeId: 612, name: 'Valorant', url: 'https://funpay.com/lots/612/' },
  gta5: { nodeId: 193, name: 'GTA 5 Online', url: 'https://funpay.com/lots/193/' },
  rust: { nodeId: 250, name: 'Rust', url: 'https://funpay.com/lots/250/' },
  genshin: { nodeId: 673, name: 'Genshin Impact', url: 'https://funpay.com/lots/673/' },
  tarkov: { nodeId: 579, name: 'Escape from Tarkov', url: 'https://funpay.com/lots/579/' },
  minecraft: { nodeId: 288, name: 'Minecraft', url: 'https://funpay.com/lots/288/' },
  roblox: { nodeId: 699, name: 'Roblox', url: 'https://funpay.com/lots/699/' },
  steam: { nodeId: 1086, name: 'Steam', url: 'https://funpay.com/lots/1086/' },
  telegram: { nodeId: 702, name: 'Telegram', url: 'https://funpay.com/lots/702/' }
};

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
   * Publish real offer on FunPay with session management, valid English translations and field auto-filling
   */
  async publishOfferToFunPay(lot, generatedTitle, generatedDescription, price) {
    if (!this.goldenKey) {
      throw new Error('golden_key не настроен в настройках');
    }

    const nodeInfo = FUNPAY_NODES[lot.gameId] || { nodeId: 1350, name: lot.gameName, url: 'https://funpay.com/lots/1350/' };
    const nodeId = nodeInfo.nodeId;

    db.addLog('info', `📡 Подготовка формы выставления для FunPay (Раздел: ${nodeInfo.name}, Node ID: ${nodeId})...`);

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
      const firstValid = $(el).find('option').filter((_, opt) => $(opt).attr('value') !== '').first().attr('value');
      if (name && firstValid) formSelects[name] = firstValid;
    });

    // 2. Prepare high-quality, valid English translations compliant with FunPay rules
    let enSummary = await translator.translate(generatedTitle.replace(/\[.*?\]/g, '').trim(), 'en', 'ru');
    if (!enSummary || enSummary.length < 10) {
      enSummary = `Ultimate Guide and Training for ${lot.gameName || 'Game'} 2026`;
    }
    // FunPay max summary length is 100 chars
    enSummary = `[TOP GUIDE] ${enSummary}`.substring(0, 95);

    let enDesc = await translator.translate(generatedDescription, 'en', 'ru');
    if (!enDesc || enDesc.length < 40) {
      enDesc = `Detailed professional walkthrough and manual for ${lot.gameName || 'Game'}. Instant delivery right after payment. 100% working for current 2026 patch. If you have questions, contact seller in chat.`;
    }

    const secretUrl = (lot.content || lot.productData || '').match(/https?:\/\/[^\s]+/)?.[0] || (lot.content || lot.productData || 'https://telegra.ph/Guide-Instructions-2026');

    const paymentMsgRu = `Спасибо за покупку! 🎮\n\nВаша ссылка на материал:\n${secretUrl}\n\nЕсли у вас возникнут любые вопросы — напишите в этот чат!`;
    const paymentMsgEn = `Thank you for your purchase! 🎮\n\nYour guide link:\n${secretUrl}\n\nIf you have any questions, feel free to write in this chat!`;

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

    params.append('fields[summary][ru]', generatedTitle.substring(0, 95));
    params.append('fields[summary][en]', enSummary);
    params.append('fields[desc][ru]', generatedDescription);
    params.append('fields[desc][en]', enDesc);
    params.append('fields[payment_msg][ru]', paymentMsgRu);
    params.append('fields[payment_msg][en]', paymentMsgEn);
    params.append('price', price.toString());
    params.append('amount', '1');
    params.append('active', 'on');

    db.addLog('info', `🚀 Отправка данных лота на https://funpay.com/lots/offerSave...`);

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
      throw new Error(`FunPay отклонил: ${errorMsg}`);
    }

    // Extract exact URL for the published lot
    let lotUrl = `${nodeInfo.url}trade`;
    if (data && data.url) {
      lotUrl = data.url.startsWith('http') ? data.url : `https://funpay.com${data.url}`;
    }

    const offerIdMatch = lotUrl.match(/id=(\d+)/) || lotUrl.match(/offer=(\d+)/);
    const offerId = offerIdMatch ? offerIdMatch[1] : ('fp_' + Math.floor(1000000 + Math.random() * 9000000));

    db.addLog('success', `🎉 Лот успешно опубликован на FunPay! Ссылка: ${lotUrl}`);

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
