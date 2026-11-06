import { translate as freeTranslate } from '@vitalets/google-translate-api';

/**
 * Free translation helper using Google Translate.
 * Translates English text to Spanish. Returns fallback or original text if empty or on error.
 */
export async function translateToEs(text: string | null | undefined): Promise<string> {
  if (!text || !text.trim()) {
    return text || '';
  }

  try {
    const res = await freeTranslate(text, { from: 'en', to: 'es' });
    return res.text;
  } catch (error) {
    console.warn('[translateToEs] Translation error, falling back to original:', error);
    return text;
  }
}

/**
 * Translates multiple CMS text fields automatically from English to Spanish.
 */
export async function autoTranslateCmsFields(fields: {
  title_en?: string;
  subtitle_en?: string;
  description_en?: string;
  badge_en?: string;
  cta_text_en?: string;
}) {
  const [title_es, subtitle_es, description_es, badge_es, cta_text_es] = await Promise.all([
    fields.title_en ? translateToEs(fields.title_en) : Promise.resolve(''),
    fields.subtitle_en ? translateToEs(fields.subtitle_en) : Promise.resolve(''),
    fields.description_en ? translateToEs(fields.description_en) : Promise.resolve(''),
    fields.badge_en ? translateToEs(fields.badge_en) : Promise.resolve(''),
    fields.cta_text_en ? translateToEs(fields.cta_text_en) : Promise.resolve(''),
  ]);

  return {
    title_es,
    subtitle_es,
    description_es,
    badge_es,
    cta_text_es,
  };
}

