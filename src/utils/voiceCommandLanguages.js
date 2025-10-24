/**
 * Voice Command Multi-Language Support
 * Defines supported languages and their command patterns
 */

export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    code: 'en-US',
    flag: '🇺🇸',
    examples: [
      'Go to MacBook Pro',
      'Open iPhone 14',
      'Show me laptops',
      'Go to cart',
    ],
  },
  bn: {
    name: 'বাংলা (Bangla)',
    code: 'bn-BD',
    flag: '🇧🇩',
    examples: [
      'এই প্রোডাক্টটা দেখাও',
      'এই প্রোডাক্টে যাও',
      'ম্যাকবুক প্রো খুলো',
      'আমাকে ল্যাপটপ দেখাও',
    ],
  },
};

/**
 * Route translations for different languages
 */
export const ROUTE_TRANSLATIONS = {
  en: {
    'home': '/',
    'homepage': '/',
    'products': '/allproduct',
    'all products': '/allproduct',
    'cart': '/addToCart',
    'shopping cart': '/addToCart',
    'wishlist': '/wishlist',
    'dashboard': '/dashboard',
    'profile': '/dashboard/my-profile',
    'my profile': '/dashboard/my-profile',
    'my orders': '/dashboard/my-orders',
    'orders': '/dashboard/my-orders',
    'offers': '/offers',
    'settings': '/dashboard/my-settings',
  },
  bn: {
    'হোম': '/',
    'মূল পাতা': '/',
    'প্রোডাক্ট': '/allproduct',
    'পণ্য': '/allproduct',
    'সব প্রোডাক্ট': '/allproduct',
    'কার্ট': '/addToCart',
    'ঝুড়ি': '/addToCart',
    'উইশলিস্ট': '/wishlist',
    'পছন্দের তালিকা': '/wishlist',
    'ড্যাশবোর্ড': '/dashboard',
    'প্রোফাইল': '/dashboard/my-profile',
    'আমার প্রোফাইল': '/dashboard/my-profile',
    'আমার অর্ডার': '/dashboard/my-orders',
    'অর্ডার': '/dashboard/my-orders',
    'অফার': '/offers',
    'সেটিংস': '/dashboard/my-settings',
  },
};

/**
 * Success message templates for different languages
 */
export const SUCCESS_MESSAGES = {
  en: {
    navigating: (destination) => `Navigating to ${destination}`,
    opening: (productName) => `Opening ${productName}`,
    showing: (category) => `Showing ${category}`,
    searchResults: (query) => `Showing search results for "${query}"`,
  },
  bn: {
    navigating: (destination) => `${destination} এ যাচ্ছি`,
    opening: (productName) => `${productName} খোলা হচ্ছে`,
    showing: (category) => `${category} দেখানো হচ্ছে`,
    searchResults: (query) => `"${query}" এর জন্য অনুসন্ধান ফলাফল দেখানো হচ্ছে`,
  },
};

/**
 * Get current language from localStorage or default to English
 */
export const getCurrentVoiceLanguage = () => {
  const saved = localStorage.getItem('voiceCommandLanguage');
  return saved || 'en';
};

/**
 * Set voice command language preference
 */
export const setVoiceLanguage = (languageCode) => {
  localStorage.setItem('voiceCommandLanguage', languageCode);
};

/**
 * Get all route mappings for current language
 */
export const getRouteMappings = () => {
  const currentLang = getCurrentVoiceLanguage();
  return {
    ...ROUTE_TRANSLATIONS.en,
    ...ROUTE_TRANSLATIONS[currentLang],
  };
};

/**
 * Get success message in current language
 */
export const getSuccessMessage = (type, value) => {
  const currentLang = getCurrentVoiceLanguage();
  const messages = SUCCESS_MESSAGES[currentLang] || SUCCESS_MESSAGES.en;
  return messages[type] ? messages[type](value) : value;
};

/**
 * Command pattern matchers for different languages
 */
export const COMMAND_PATTERNS = {
  en: [
    {
      // "Go to [target]" or "Open [target]"
      pattern: /^(?:go\s+to|open)\s+(.+)/i,
      extract: (match) => match[1].trim(),
      type: 'navigation',
    },
    {
      // "Show me [category]"
      pattern: /show\s+me\s+(.+)/i,
      extract: (match) => match[1].trim(),
      type: 'search',
    },
  ],
  bn: [
    {
      // "এই প্রোডাক্টটা দেখাও" or "প্রোডাক্ট দেখাও"
      pattern: /(?:এই\s+)?(?:প্রোডাক্ট(?:টা|টি)?|পণ্য(?:টা|টি)?)\s*দেখাও\s*(.*)/,
      extract: (match, fullText) => {
        const extracted = match[1]?.trim();
        return extracted || fullText.replace(/(?:এই\s+)?(?:প্রোডাক্ট(?:টা|টি)?|পণ্য(?:টা|টি)?)\s*দেখাও\s*/g, '').trim();
      },
      type: 'navigation',
    },
    {
      // "এই প্রোডাক্টে যাও" or "প্রোডাক্টে যাও"
      pattern: /(?:এই\s+)?(?:প্রোডাক্ট(?:ে|টিতে)?|পণ্য(?:ে|টিতে)?)\s*যাও\s*(.*)/,
      extract: (match, fullText) => {
        const extracted = match[1]?.trim();
        return extracted || fullText.replace(/(?:এই\s+)?(?:প্রোডাক্ট(?:ে|টিতে)?|পণ্য(?:ে|টিতে)?)\s*যাও\s*/g, '').trim();
      },
      type: 'navigation',
    },
    {
      // "[product name] খুলো" or "[product name] দেখাও"
      pattern: /^(.+?)\s*(?:খুলো|দেখাও)$/,
      extract: (match) => match[1].trim(),
      type: 'navigation',
    },
    {
      // "আমাকে [category] দেখাও"
      pattern: /আমাকে\s+(.+?)\s*দেখাও/,
      extract: (match) => match[1].trim(),
      type: 'search',
    },
  ],
};

/**
 * Parse voice command and extract intent
 */
export const parseVoiceIntent = (transcript) => {
  const currentLang = getCurrentVoiceLanguage();
  
  // Try patterns for current language first
  const langPatterns = COMMAND_PATTERNS[currentLang] || [];
  for (const { pattern, extract, type } of langPatterns) {
    const match = transcript.match(pattern);
    if (match) {
      const target = extract(match, transcript);
      if (target) {
        return { type, target, language: currentLang };
      }
    }
  }
  
  // Try English patterns as fallback
  if (currentLang !== 'en') {
    for (const { pattern, extract, type } of COMMAND_PATTERNS.en) {
      const match = transcript.match(pattern);
      if (match) {
        const target = extract(match, transcript);
        if (target) {
          return { type, target, language: 'en' };
        }
      }
    }
  }
  
  return null;
};
