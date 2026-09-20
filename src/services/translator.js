import axios from 'axios';

// Gaming dictionary fallback for high-quality terminology translation
const GAMING_GLOSSARY = {
  'гайд': 'guide',
  'мануал': 'manual',
  'руководство': 'walkthrough',
  'раскидки': 'lineups',
  'смоки': 'smokes',
  'флешки': 'flashbangs',
  'молотовы': 'molotovs',
  'калибровка': 'placement calibration',
  'буст': 'boost',
  'коучинг': 'coaching',
  'обучение': 'training',
  'разбор демки': 'demo review',
  'настройки': 'settings',
  'конфиг': 'config',
  'автовыдача': 'instant auto-delivery',
  'моментально': 'instant delivery',
  'гарантия': '100% guarantee',
  'лучший': 'best',
  'секреты': 'secrets',
  'билд': 'build',
  'фарм': 'farming',
  'без читов': 'no cheats / clean',
  'быстро': 'fast',
  'прокачка': 'leveling up'
};

class Translator {
  /**
   * Translate text using Google Translate free endpoint with local fallback
   * @param {string} text 
   * @param {string} targetLang ('en' or 'ru')
   * @param {string} sourceLang ('auto', 'ru', 'en')
   * @returns {Promise<string>}
   */
  async translate(text, targetLang = 'en', sourceLang = 'auto') {
    if (!text || typeof text !== 'string') return text;
    if (targetLang === sourceLang) return text;

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await axios.get(url, {
        timeout: 6000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (response.data && Array.isArray(response.data[0])) {
        const translatedSegments = response.data[0]
          .filter(segment => segment && segment[0])
          .map(segment => segment[0])
          .join('');
        
        if (translatedSegments && translatedSegments.trim().length > 0) {
          return translatedSegments;
        }
      }
    } catch (err) {
      // Fallback if online request fails
      console.warn(`[Translator] Online translation warning: ${err.message}. Using glossary fallback.`);
    }

    return this.fallbackTranslate(text, targetLang);
  }

  fallbackTranslate(text, targetLang = 'en') {
    if (targetLang !== 'en') return text;
    let result = text;
    for (const [ru, en] of Object.entries(GAMING_GLOSSARY)) {
      const regex = new RegExp(`\\b${ru}\\b`, 'gi');
      result = result.replace(regex, en);
    }
    return result;
  }

  /**
   * Translate both title and description for a lot
   */
  async translateLot(lot, targetLang = 'en') {
    const translatedTitle = await this.translate(lot.title, targetLang, 'ru');
    const translatedDesc = await this.translate(lot.description, targetLang, 'ru');
    const translatedShortDesc = lot.shortDesc ? await this.translate(lot.shortDesc, targetLang, 'ru') : '';

    return {
      title: translatedTitle,
      shortDesc: translatedShortDesc,
      description: translatedDesc
    };
  }
}

export const translator = new Translator();
export default translator;
