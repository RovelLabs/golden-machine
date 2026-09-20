import { translator } from './translator.js';

// Deep combinatorics dictionary for tens of thousands of unique variations
const EMOJIS = ['🔥', '⚡', '💎', '🚀', '⭐', '🏆', '🎯', '👑', '🌟', '🛡️', '🎮', '💥', '✨', '🥇'];

const PREFIXES = [
  'ТОП', 'СУПЕР', 'PRO', 'ULTIMATE', 'ЛУЧШИЙ', 'ЭКСКЛЮЗИВ', 'НОВИНКА 2026', 
  'ХИТ', 'АКТУАЛЬНО', 'ПРЕМИУМ', '100% РАБОЧИЙ', 'МГНОВЕННО', 'АВТОВЫДАЧА'
];

const QUALITY_ADJECTIVES = [
  'Полный подробный', 'Пошаговый профессиональный', 'Самый актуальный', 
  'Секретный закрытый', 'Топовый авторский', 'Эксклюзивный рабочий', 
  'Быстрый и надежный', 'Проверенный временем', 'Ультимативный мощный'
];

const TRUST_TAGS = [
  '[ГАРАНТИЯ 100%]', '[АВТОВЫДАЧА 24/7]', '[БЕЗ БАНА]', '[СВЕЖИЙ ПАТЧ]', 
  '[ОТ ПРО-ИГРОКА]', '[МОМЕНТАЛЬНО]', '[ПОДДЕРЖКА 24/7]', '[ПРОВЕРЕНО]', '[БЕЗ ПОСРЕДНИКОВ]'
];

const ACTION_SUFFIXES = [
  'Подходит для всех!', 'Забирай прямо сейчас!', 'Быстрый старт за 5 минут!', 
  'Результат гарантирован!', 'Отзывы в профиле!', 'Помощь в установке!'
];

export class ContentGenerator {
  /**
   * Parse spintax text format: {option1|option2|option3}
   */
  parseSpintax(text) {
    if (!text || typeof text !== 'string') return '';
    const spintaxRegex = /\{([^{}]+)\}/g;
    let matches;
    while ((matches = spintaxRegex.exec(text)) !== null) {
      const options = matches[1].split('|');
      const chosen = options[Math.floor(Math.random() * options.length)];
      text = text.replace(matches[0], chosen);
      spintaxRegex.lastIndex = 0;
    }
    return text;
  }

  /**
   * Pick random item from array
   */
  randomChoice(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Pick N unique random items from array
   */
  randomSample(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Calculate theoretical combinations count for transparency
   */
  getCombinationsCount(lot) {
    const emojis = EMOJIS.length;
    const prefixes = PREFIXES.length;
    const adjectives = QUALITY_ADJECTIVES.length;
    const trustTags = TRUST_TAGS.length;
    const suffixes = ACTION_SUFFIXES.length;
    // Combinations = emojis * prefixes * adjectives * trustTags * suffixes
    return emojis * prefixes * adjectives * trustTags * suffixes; // ~ 14 * 13 * 9 * 9 * 6 = 88,452 variations
  }

  /**
   * Generate an ultra-unique title for the lot
   * @param {Object} lot 
   * @param {Object} options { language: 'ru' | 'en' | 'both', includeEmoji: true, includeTags: true }
   */
  async generateTitle(lot, options = {}) {
    const {
      language = 'ru',
      includeEmoji = true,
      includeTags = true,
      customPrefix = ''
    } = options;

    const emoji = includeEmoji ? this.randomChoice(EMOJIS) + ' ' : '';
    const prefix = customPrefix || `[${this.randomChoice(PREFIXES)}]`;
    const adj = this.randomChoice(QUALITY_ADJECTIVES);
    const tag = includeTags ? ` ${this.randomChoice(TRUST_TAGS)}` : '';

    // Core subject
    let baseTitle = lot.title;
    // Strip old emojis/brackets if present to prevent duplication
    baseTitle = baseTitle.replace(/^[🔥⚡💎🚀⭐🏆🎯👑🌟🛡️🎮💥✨🥇\s\[\]\w-]+:\s*/, '').trim();

    let ruTitle = `${emoji}${prefix} ${adj} ${baseTitle}${tag}`;
    // Limit to FunPay max title length (~100 chars)
    if (ruTitle.length > 100) {
      ruTitle = `${emoji}${prefix} ${baseTitle}${tag}`;
    }
    if (ruTitle.length > 100) {
      ruTitle = ruTitle.substring(0, 97) + '...';
    }

    if (language === 'en') {
      const translated = await translator.translate(ruTitle, 'en', 'ru');
      return translated;
    } else if (language === 'both') {
      const translated = await translator.translate(baseTitle, 'en', 'ru');
      const combined = `${ruTitle} / EN: ${translated}`;
      return combined.length > 100 ? ruTitle : combined;
    }

    return ruTitle;
  }

  /**
   * Generate a structured, attractive description for the lot
   * @param {Object} lot 
   * @param {Object} options 
   */
  async generateDescription(lot, options = {}) {
    const header = `${this.randomChoice(EMOJIS)} ${lot.title} — актуально для патча 2026.`;
    const coreDesc = (lot.shortDesc || lot.description || '')
      .replace(/[\r\n]+/g, ' — ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .substring(0, 250);
    const safety = `✅ 100% безопасность для аккаунта. Моментальная автовыдача информации.`;
    const support = `💬 Поддержка в чате 24/7. Отвечу на любые вопросы и подскажу детали!`;

    const ruDescription = `${header}\n${coreDesc}\n${safety}\n${support}`;
    return ruDescription;
  }

  /**
   * Generate post-purchase automated message
   */
  generateBuyerMessage(lot, template, orderData = {}) {
    const templateText = template?.buyerMessageTemplate || 
      'Спасибо за покупку! 🎮\n\nВаш заказ:\n{guide_content}\n\nЕсли возникнут вопросы, пишите в чат!';

    const content = lot.content || lot.productData || 'Материал и инструкция отправлены в заказе.';
    
    let message = templateText
      .replace('{guide_content}', content)
      .replace('{product_data}', content)
      .replace('{lot_name}', lot.title)
      .replace('{order_id}', orderData.orderId || ('FP-' + Math.floor(100000 + Math.random() * 900000)))
      .replace('{username}', orderData.buyerUsername || 'Покупатель');

    return this.parseSpintax(message);
  }
}

export const generator = new ContentGenerator();
export default generator;
