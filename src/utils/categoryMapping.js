/**
 * Category Mapping Utility for Voice-Based Search
 * Maps user voice input to internal category names with synonym support
 * Supports both English and Bengali languages
 */

/**
 * Bengali to English category mapping
 * Maps Bengali category names to internal English category IDs/slugs
 */
export const BENGALI_CATEGORY_MAP = {
  // Electronics
  'ইলেকট্রনিক্স': 'electronics',
  'ইলেকট্রনিক': 'electronics',
  'ইলেক্ট্রনিক্স': 'electronics',
  'গ্যাজেট': 'electronics',
  'গ্যাজেটস': 'electronics',
  
  // Mobile/Smartphones
  'মোবাইল': 'mobile',
  'মোবাইল ফোন': 'mobile',
  'স্মার্টফোন': 'mobile',
  'ফোন': 'mobile',
  'হ্যান্ডসেট': 'mobile',
  
  // Laptop
  'ল্যাপটপ': 'laptop',
  'ল্যাপটপস': 'laptop',
  'নোটবুক': 'laptop',
  'কম্পিউটার': 'laptop',
  
  // Tablet
  'ট্যাবলেট': 'tablet',
  'ট্যাব': 'tablet',
  'আইপ্যাড': 'tablet',
  
  // Accessories
  'অ্যাক্সেসরিজ': 'accessories',
  'এক্সেসরিজ': 'accessories',
  'মোবাইল এক্সেসরিজ': 'accessories',
  
  // Headphones
  'হেডফোন': 'headphones',
  'ইয়ারফোন': 'headphones',
  'ইয়ারবাড': 'headphones',
  'হেডসেট': 'headphones',
  'স্পিকার': 'headphones',
  
  // Smartwatch
  'স্মার্টওয়াচ': 'smartwatch',
  'স্মার্ট ওয়াচ': 'smartwatch',
  'ঘড়ি': 'smartwatch',
  
  // Camera
  'কামেরা': 'camera',
  'ডিজিটাল কামেরা': 'camera',
  'ডিএসএলআর': 'camera',
  
  // Gaming
  'গেমিং': 'gaming',
  'গেম': 'gaming',
  'কনসোল': 'gaming',
  'প্লেস্টেশন': 'gaming',
  
  // TV
  'টিভি': 'tv',
  'টেলিভিশন': 'tv',
  'স্মার্ট টিভি': 'tv',
  'মনিটর': 'tv',
  
  // Storage
  'স্টোরেজ': 'storage',
  'হার্ড ড্রাইভ': 'storage',
  'পেনড্রাইভ': 'storage',
  'মেমরি কার্ড': 'storage',
};

/**
 * Category synonyms and variations for voice recognition
 * Handles common mispronunciations, plural forms, and related terms
 */
export const CATEGORY_SYNONYMS = {
  // Electronics
  electronics: [
    "electronics",
    "electronic",
    "electronic items",
    "electronic products",
    "tech products",
    "technology",
    "gadgets",
    "gadget",
  ],
  
  // Mobile/Smartphones
  mobile: [
    "mobile",
    "mobiles",
    "mobile phone",
    "mobile phones",
    "phone",
    "phones",
    "smartphone",
    "smartphones",
    "smart phone",
    "smart phones",
    "cell phone",
    "cellphone",
    "handset",
    "handsets",
  ],
  
  // Laptops
  laptop: [
    "laptop",
    "laptops",
    "notebook",
    "notebooks",
    "computer",
    "computers",
    "portable computer",
    "portable computers",
  ],
  
  // Tablets
  tablet: [
    "tablet",
    "tablets",
    "tab",
    "tabs",
    "ipad",
    "ipads",
    "tablet computer",
  ],
  
  // Accessories
  accessories: [
    "accessories",
    "accessory",
    "mobile accessories",
    "phone accessories",
    "laptop accessories",
    "computer accessories",
    "tech accessories",
  ],
  
  // Headphones/Audio
  headphones: [
    "headphones",
    "headphone",
    "earphones",
    "earphone",
    "earbuds",
    "earbud",
    "airpods",
    "headset",
    "headsets",
    "audio",
    "speaker",
    "speakers",
  ],
  
  // Smartwatch/Wearables
  smartwatch: [
    "smartwatch",
    "smartwatches",
    "smart watch",
    "smart watches",
    "wearable",
    "wearables",
    "fitness tracker",
    "fitness band",
  ],
  
  // Camera
  camera: [
    "camera",
    "cameras",
    "digital camera",
    "dslr",
    "mirrorless",
    "action camera",
    "photography",
  ],
  
  // Gaming
  gaming: [
    "gaming",
    "games",
    "game",
    "gaming console",
    "console",
    "playstation",
    "xbox",
    "nintendo",
    "gaming accessories",
  ],
  
  // TV/Display
  tv: [
    "tv",
    "television",
    "televisions",
    "smart tv",
    "monitor",
    "monitors",
    "display",
    "displays",
    "screen",
  ],
  
  // Storage
  storage: [
    "storage",
    "hard drive",
    "hard drives",
    "ssd",
    "hdd",
    "external drive",
    "pen drive",
    "flash drive",
    "memory card",
  ],
};

/**
 * Find the best matching category from voice input
 * Supports both English and Bengali
 * @param {string} voiceInput - Raw voice input from user
 * @returns {string|null} - Matched category name or null
 */
export const matchCategory = (voiceInput) => {
  if (!voiceInput) return null;
  
  const normalized = voiceInput.toLowerCase().trim();
  
  // FIRST: Check Bengali category mapping (exact match)
  if (BENGALI_CATEGORY_MAP[normalized]) {
    return BENGALI_CATEGORY_MAP[normalized];
  }
  
  // Check Bengali partial match
  for (const [bengali, english] of Object.entries(BENGALI_CATEGORY_MAP)) {
    if (normalized.includes(bengali) || bengali.includes(normalized)) {
      return english;
    }
  }
  
  // SECOND: Try English exact match
  for (const [category, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (synonyms.includes(normalized)) {
      return category;
    }
  }
  
  // THIRD: Try English partial match
  for (const [category, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    for (const synonym of synonyms) {
      if (normalized.includes(synonym) || synonym.includes(normalized)) {
        return category;
      }
    }
  }
  
  return null;
};

/**
 * Extract category from common voice command patterns
 * Supports both English and Bengali patterns
 * Patterns: "Show me [category]", "Find [category]", "দেখাও [category]", "খুঁজে দাও [category]"
 * @param {string} voiceCommand - Full voice command
 * @returns {Object} - { category, searchQuery, language }
 */
export const parseCategoryCommand = (voiceCommand) => {
  if (!voiceCommand) return { category: null, searchQuery: null, language: null };
  
  const normalized = voiceCommand.toLowerCase().trim();
  
  // Detect if input contains Bengali characters
  const isBengali = /[\u0980-\u09FF]/.test(normalized);
  
  // Bengali command patterns
  if (isBengali) {
    // Pattern 1: "দেখাও [category]" or "দেখান [category]"
    const showPatternBn = /^(?:দেখাও|দেখান|দেখা)\s+(.+)$/;
    const showMatch = normalized.match(showPatternBn);
    if (showMatch) {
      const extracted = showMatch[1];
      const category = matchCategory(extracted);
      return {
        category,
        searchQuery: category ? null : extracted,
        command: "show",
        language: "bengali",
      };
    }
    
    // Pattern 2: "খুঁজে দাও [category]" or "খুঁজুন [category]"
    const findPatternBn = /^(?:খুঁজে\s+দাও|খুঁজুন|খুঁজো|খোঁজ)\s+(.+)$/;
    const findMatch = normalized.match(findPatternBn);
    if (findMatch) {
      const extracted = findMatch[1];
      const category = matchCategory(extracted);
      return {
        category,
        searchQuery: category ? null : extracted,
        command: "find",
        language: "bengali",
      };
    }
    
    // Pattern 3: "আমাকে [category] দেখান" or "[category] চাই"
    const wantPatternBn = /(?:আমাকে\s+(.+)\s+(?:দেখান|দেখাও))|(?:(.+)\s+চাই)$/;
    const wantMatch = normalized.match(wantPatternBn);
    if (wantMatch) {
      const extracted = wantMatch[1] || wantMatch[2];
      const category = matchCategory(extracted);
      return {
        category,
        searchQuery: category ? null : extracted,
        command: "want",
        language: "bengali",
      };
    }
    
    // Pattern 4: Direct Bengali category mention
    const category = matchCategory(normalized);
    if (category) {
      return { category, searchQuery: null, command: "direct", language: "bengali" };
    }
    
    // No pattern matched - treat as general search query
    return {
      category: null,
      searchQuery: normalized,
      command: "search",
      language: "bengali",
    };
  }
  
  // English command patterns (existing code)
  
  // Pattern 1: "Show me [category]" or "Show [category]"
  const showPattern = /^(?:show|display|view)\s+(?:me\s+)?(.+)$/i;
  const showMatch = normalized.match(showPattern);
  if (showMatch) {
    const extracted = showMatch[1];
    const category = matchCategory(extracted);
    return {
      category,
      searchQuery: category ? null : extracted, // If no category, treat as search
      command: "show",
    };
  }
  
  // Pattern 2: "Find [category]" or "Search [category]"
  const findPattern = /^(?:find|search|look\s+for)\s+(?:me\s+)?(.+)$/i;
  const findMatch = normalized.match(findPattern);
  if (findMatch) {
    const extracted = findMatch[1];
    const category = matchCategory(extracted);
    return {
      category,
      searchQuery: category ? null : extracted,
      command: "find",
    };
  }
  
  // Pattern 3: "Give me [category]" or "I want [category]"
  const wantPattern = /^(?:give\s+me|i\s+want|i\s+need)\s+(.+)$/i;
  const wantMatch = normalized.match(wantPattern);
  if (wantMatch) {
    const extracted = wantMatch[1];
    const category = matchCategory(extracted);
    return {
      category,
      searchQuery: category ? null : extracted,
      command: "want",
    };
  }
  
  // Pattern 4: Direct category mention
  const category = matchCategory(normalized);
  if (category) {
    return { category, searchQuery: null, command: "direct" };
  }
  
  // No pattern matched - treat as general search query
  return {
    category: null,
    searchQuery: normalized,
    command: "search",
    language: "english",
  };
};

/**
 * Get user-friendly category display name
 * Supports both English and Bengali
 * @param {string} category - Internal category name
 * @param {string} language - Language preference ('english' or 'bengali')
 * @returns {string} - Display name
 */
export const getCategoryDisplayName = (category, language = 'english') => {
  const displayNames = {
    electronics: language === 'bengali' ? "ইলেকট্রনিক্স" : "Electronics",
    mobile: language === 'bengali' ? "মোবাইল ফোন" : "Mobile Phones",
    laptop: language === 'bengali' ? "ল্যাপটপ" : "Laptops",
    tablet: language === 'bengali' ? "ট্যাবলেট" : "Tablets",
    accessories: language === 'bengali' ? "অ্যাক্সেসরিজ" : "Accessories",
    headphones: language === 'bengali' ? "হেডফোন ও অডিও" : "Headphones & Audio",
    smartwatch: language === 'bengali' ? "স্মার্টওয়াচ" : "Smartwatches & Wearables",
    camera: language === 'bengali' ? "কামেরা" : "Cameras",
    gaming: language === 'bengali' ? "গেমিং" : "Gaming",
    tv: language === 'bengali' ? "টিভি ও ডিসপ্লে" : "TVs & Displays",
    storage: language === 'bengali' ? "স্টোরেজ" : "Storage Devices",
  };
  
  return displayNames[category] || category;
};

/**
 * Get all available categories (for dropdown/suggestions)
 * @returns {Array} - List of categories with display names
 */
export const getAllCategories = () => {
  return Object.keys(CATEGORY_SYNONYMS).map(category => ({
    value: category,
    label: getCategoryDisplayName(category),
    synonyms: CATEGORY_SYNONYMS[category],
  }));
};

/**
 * Validate if a string is a known category
 * @param {string} input - Input to validate
 * @returns {boolean}
 */
export const isValidCategory = (input) => {
  return matchCategory(input) !== null;
};

/**
 * Get helpful clarification message when category is ambiguous
 * Supports both English and Bengali
 * @param {string} voiceInput - Ambiguous input
 * @param {string} language - Language preference
 * @returns {string} - Clarification message
 */
export const getClarificationMessage = (voiceInput, language = 'english') => {
  const categories = getAllCategories()
    .map(cat => getCategoryDisplayName(cat.value, language))
    .join(", ");
  
  if (language === 'bengali') {
    return `এই ক্যাটাগরি খুঁজে পাওয়া যায়নি। উপলব্ধ ক্যাটাগরি: ${categories}। অনুগ্রহ করে আবার চেষ্টা করুন।`;
  }
  
  return `I couldn't find that category. Available categories: ${categories}. Please try again.`;
};

/**
 * Get "No products found in category" message
 * @param {string} category - Category name
 * @param {string} language - Language preference
 * @returns {string} - Custom message
 */
export const getNoProductsInCategoryMessage = (category, language = 'english') => {
  const displayName = getCategoryDisplayName(category, language);
  
  if (language === 'bengali') {
    return `${displayName} ক্যাটাগরিতে কোন প্রোডাক্ট পাওয়া যায়নি। অনুগ্রহ করে অন্য ক্যাটাগরি চেষ্টা করুন।`;
  }
  
  return `No products found in ${displayName} category. Please try another one.`;
};

export default {
  BENGALI_CATEGORY_MAP,
  CATEGORY_SYNONYMS,
  matchCategory,
  parseCategoryCommand,
  getCategoryDisplayName,
  getAllCategories,
  isValidCategory,
  getClarificationMessage,
  getNoProductsInCategoryMessage,
};
