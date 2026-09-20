import { db } from '../database/db.js';
import { generator } from './generator.js';
import { translator } from './translator.js';

class AutoMessenger {
  /**
   * Format and optionally translate delivery message for buyer
   */
  async formatMessage(lot, template, orderData = {}) {
    const rawMessage = generator.generateBuyerMessage(lot, template, orderData);
    const settings = db.getSettings();

    if (settings.translateToEnglish) {
      if (settings.includeBothLanguages) {
        const enMessage = await translator.translate(rawMessage, 'en', 'ru');
        return `${rawMessage}\n\n----------------------------------------\n🌐 ENGLISH VERSION:\n----------------------------------------\n${enMessage}`;
      } else {
        return await translator.translate(rawMessage, 'en', 'ru');
      }
    }

    return rawMessage;
  }

  /**
   * Process a simulated or incoming paid order
   */
  async handleNewOrder(order) {
    const lot = db.getLotById(order.lotId) || {
      title: order.title || 'Товар Golden Machine',
      content: order.content || 'Инструкция по использованию товара.',
      templateType: order.templateType || 'template1_guides'
    };

    const templates = db.getTemplates();
    const template = templates[lot.templateType] || templates.template1_guides;

    const message = await this.formatMessage(lot, template, {
      orderId: order.id,
      buyerUsername: order.buyerUsername
    });

    db.addLog('success', `💬 Авто-сообщение отправлено покупателю ${order.buyerUsername || ''} по заказу #${order.id}`);
    db.incrementMessageStat();

    return {
      orderId: order.id,
      sentAt: new Date().toISOString(),
      message
    };
  }
}

export const autoMessenger = new AutoMessenger();
export default autoMessenger;
