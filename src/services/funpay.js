import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from '../database/db.js';

export class FunPayClient {
  constructor() {
    this.baseUrl = 'https://funpay.com';
    this.goldenKey = '';
    this.user = null;
    this.csrfToken = '';
    this.appData = null;
  }

  setGoldenKey(key) {
    this.goldenKey = (key || '').trim();
    db.updateSettings({ goldenKey: this.goldenKey });
  }

  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cookie': `golden_key=${this.goldenKey}; cookie_test=1`,
      'Referer': 'https://funpay.com/'
    };
  }

  /**
   * Validate golden_key by scraping user profile page on FunPay
   */
  async checkAuth(key = null) {
    if (key) this.goldenKey = key.trim();
    if (!this.goldenKey) {
      this.user = null;
      return { valid: false, message: 'golden_key не указан' };
    }

    try {
      db.addLog('info', 'Проверка токена golden_key на FunPay...');
      const response = await axios.get(this.baseUrl, {
        headers: this.getHeaders(),
        timeout: 10000
      });

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
          message: 'golden_key недействителен или истек'
        };
      }

      // Parse user details
      const userName = userLink.first().text().trim() || 'FunPay User';
      const userHref = userLink.first().attr('href') || '';
      const userIdMatch = userHref.match(/\/users\/(\d+)\//);
      const userId = userIdMatch ? userIdMatch[1] : 'unknown';

      // Parse balance
      const balanceEl = $('.badge-balance, .user-link-balance, .balance-total');
      const balance = balanceEl.text().trim() || '0 ₽';

      // Parse avatar
      const avatarEl = $('.user-link-photo, .navbar-user img');
      const avatarUrl = avatarEl.attr('src') || 'https://funpay.com/img/layout/avatar.png';

      // Extract CSRF or app data if present in page
      const appDataScript = $('body').attr('data-app-data');
      if (appDataScript) {
        try {
          this.appData = JSON.parse(appDataScript);
          this.csrfToken = this.appData.csrf_token || this.csrfToken;
        } catch (e) {}
      }

      this.user = {
        id: userId,
        username: userName,
        balance: balance,
        avatar: avatarUrl,
        profileUrl: `https://funpay.com/users/${userId}/`,
        lastChecked: new Date().toISOString()
      };

      db.addLog('success', `Успешная авторизация FunPay: ${userName} (ID: ${userId}) | Баланс: ${balance}`);
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
   * Get user active lots list from FunPay profile
   */
  async getUserActiveLots() {
    if (!this.user || !this.user.id) {
      return [];
    }

    try {
      const response = await axios.get(`https://funpay.com/users/${this.user.id}/`, {
        headers: this.getHeaders(),
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const lots = [];

      $('.tc-item').each((_, el) => {
        const item = $(el);
        const title = item.find('.tc-desc-text').text().trim();
        const price = item.find('.tc-price').text().trim();
        const href = item.attr('href') || '';
        const offerId = href.match(/id=(\d+)/)?.[1] || '';

        if (title) {
          lots.push({
            offerId,
            title,
            price,
            url: href.startsWith('http') ? href : `https://funpay.com${href}`
          });
        }
      });

      return lots;
    } catch (err) {
      console.error('[FunPay] Error getting user lots:', err.message);
      return [];
    }
  }

  /**
   * Raise (bump) lots for a specific game/node on FunPay
   */
  async raiseLots(nodeId, gameId = null) {
    if (!this.goldenKey) {
      throw new Error('golden_key не настроен');
    }

    try {
      db.addLog('info', `Запрос на автоподнятие лотов (node_id: ${nodeId || 'all'})...`);
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

      db.incrementBumpStat();
      db.addLog('success', `Лоты успешно подняты на FunPay! Статус: ${response.data?.msg || 'OK'}`);
      return response.data;
    } catch (err) {
      db.addLog('warning', `Ответ автоподнятия FunPay: ${err.response?.data?.msg || err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Publish or update a lot on FunPay
   */
  async saveOffer(offerData) {
    if (!this.goldenKey) {
      throw new Error('golden_key не настроен');
    }

    try {
      db.addLog('info', `Публикация лота: "${offerData.title}"...`);
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(offerData)) {
        params.append(key, value);
      }

      const response = await axios.post(`${this.baseUrl}/lots/offerSave`, params, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 12000
      });

      db.addLog('success', `Лот успешно отправлен на FunPay: "${offerData.title}"`);
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.msg || err.message;
      db.addLog('error', `Ошибка публикации лота "${offerData.title}": ${errMsg}`);
      throw new Error(errMsg);
    }
  }
}

export const funpay = new FunPayClient();
export default funpay;
