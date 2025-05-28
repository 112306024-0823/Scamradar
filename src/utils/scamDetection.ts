// 詐騙偵測工具函數

// 詐騙類型定義
export enum ScamType {
  INVESTMENT = 'investment',
  SHOPPING = 'shopping',
  IMPERSONATION = 'impersonation',
  PHISHING = 'phishing',
  PRIZE = 'prize',
  JOB = 'job',
  PAYMENT = 'payment',
  UNKNOWN = 'unknown'
}

// 詐騙警告級別
export type WarningLevel = 'low' | 'medium' | 'high';

// 警告級別常數
export const WARNING_LEVEL = {
  LOW: 'low' as WarningLevel,
  MEDIUM: 'medium' as WarningLevel,
  HIGH: 'high' as WarningLevel
};

// 警告結果介面
export interface DetectionResult {
  isScam: boolean;
  level: WarningLevel;
  type: ScamType;
  reason: string;
  tips: string[];
}

// 詐騙關鍵詞配置
const scamKeywords = {
  [ScamType.INVESTMENT]: [
    '保證', '獲利', '回報', '投資', '股票', '賺錢', '致富', '錢生錢',
    '穩賺', '翻倍', '賭場', '博弈', '快速', '暴富', '發大財', '財富自由'
  ],
  [ScamType.SHOPPING]: [
    '特價', '限時', '免費', '優惠', '折扣', '限量', '秒殺', '買一送一',
    '清倉', '出清', '特賣', '促銷', '下單', '訂購', '點我', '立即'
  ],
  [ScamType.IMPERSONATION]: [
    '我是', '銀行', '警察', '客服', '認證', '驗證', '身分', '核對',
    '確認', '安全', '客戶', '帳戶', '用戶', '會員', '身份', '帳號'
  ],
  [ScamType.PHISHING]: [
    '連結', '網址', '登入', '登錄', '點擊', '網站', '官方', '驗證',
    '確認', '查詢', '檢視', '點選', '更新', '系統', '帳號', '密碼'
  ],
  [ScamType.PRIZE]: [
    '中獎', '獲獎', '得獎', '幸運', '抽獎', '獎品', '獎金', '獎勵',
    '領取', '禮品', '恭喜', '祝賀', '兌換', '專屬', '專有', '得主'
  ],
  [ScamType.JOB]: [
    '兼職', '打工', '工作', '求職', '招聘', '應徵', '面試', '職缺',
    '高薪', '時薪', '日薪', '週薪', '月薪', '年薪', '收入', '待遇'
  ],
  [ScamType.PAYMENT]: [
    '付款', '支付', '轉帳', '匯款', '款項', '金額', '銀行', '帳戶',
    '提款', '信用卡', '簽帳卡', '卡號', '到期日', '安全碼', '驗證碼', 'ATM'
  ]
};

// 詐騙語法模式配置
const scamPatterns = [
  { pattern: /!{2,}/g, level: WARNING_LEVEL.LOW, reason: '連續多個驚嘆號' },
  { pattern: /\?{2,}/g, level: WARNING_LEVEL.LOW, reason: '連續多個問號' },
  { pattern: /私訊/g, level: WARNING_LEVEL.MEDIUM, reason: '要求私下聯繫' },
  { pattern: /LINE|WeChat|Telegram|Messenger/gi, level: WARNING_LEVEL.LOW, reason: '提及社交媒體' },
  { pattern: /http:\/\//g, level: WARNING_LEVEL.MEDIUM, reason: '不安全的 HTTP 連結' },
  { pattern: /https?:\/\/[^\s]{5,}/g, level: WARNING_LEVEL.MEDIUM, reason: '含有網址連結' },
  { pattern: /\d{8,}/g, level: WARNING_LEVEL.LOW, reason: '包含長數字' },
  { pattern: /[^\u0000-\u007F]+/g, level: WARNING_LEVEL.LOW, reason: '包含特殊字元或簡體字' },
  { pattern: /急需|緊急|馬上|立即|立刻|快/g, level: WARNING_LEVEL.MEDIUM, reason: '表達緊急性' },
  { pattern: /轉帳|匯款|付款|支付|信用卡|卡號/g, level: WARNING_LEVEL.HIGH, reason: '要求金錢交易' },
  { pattern: /幫忙|協助|幫助|救命/g, level: WARNING_LEVEL.MEDIUM, reason: '請求幫助' },
  { pattern: /免費|贈品|優惠|折扣|限時|特價/g, level: WARNING_LEVEL.MEDIUM, reason: '提供特殊優惠' },
  { pattern: /中獎|得獎|幸運|抽中/g, level: WARNING_LEVEL.HIGH, reason: '宣稱中獎' },
  { pattern: /銀行|帳戶|登入|密碼|驗證碼|認證/g, level: WARNING_LEVEL.HIGH, reason: '要求敏感資訊' },
  { pattern: /保密|秘密|不要告訴|別說/g, level: WARNING_LEVEL.HIGH, reason: '要求保密' },
  { pattern: /投資|回報|獲利|收益|賺錢/g, level: WARNING_LEVEL.HIGH, reason: '承諾投資回報' },
  { pattern: /填寫|表格|資料|個人|身分|地址|電話/g, level: WARNING_LEVEL.MEDIUM, reason: '索取個人資料' },
  { pattern: /bit\.ly|tinyurl|goo\.gl|短網址/gi, level: WARNING_LEVEL.HIGH, reason: '使用短網址' }
];

// 防詐騙小技巧
const scamTips = {
  [ScamType.INVESTMENT]: [
    '合法投資機會不會保證獲利或高回報',
    '投資前應查詢業者是否有合法執照',
    '避免投資過高風險或不熟悉的投資標的',
    '拒絕來路不明的投資建議'
  ],
  [ScamType.SHOPPING]: [
    '購物前請確認網站的合法性和評價',
    '使用有信用卡保障的付款方式',
    '過低的價格通常有誇大不實或品質問題',
    '避免透過非官方管道付款'
  ],
  [ScamType.IMPERSONATION]: [
    '政府機關、銀行不會透過通訊軟體聯繫要求個人資料',
    '接到陌生來電，請主動掛斷並撥打官方電話確認',
    '不要聽信對方的指示前往 ATM 操作',
    '親友突然要求金錢援助，請透過其他管道確認身分'
  ],
  [ScamType.PHISHING]: [
    '不要點擊不明連結，尤其是要求輸入個人資料的網站',
    '檢查網址是否為官方網站，注意拼寫錯誤或奇怪的網域名稱',
    '直接在瀏覽器輸入官方網址，而非透過連結進入',
    '啟用雙重驗證，提高帳號安全性'
  ],
  [ScamType.PRIZE]: [
    '未參加的活動不可能中獎',
    '真正的中獎不會要求繳納手續費或稅金',
    '官方活動會透過正式管道通知，而非私人訊息',
    '若有疑慮，請直接聯繫官方客服查詢'
  ],
  [ScamType.JOB]: [
    '合法工作不會要求先繳納費用或提供個人敏感資料',
    '查詢公司背景和評價，確認其真實性',
    '高薪低工時的工作通常有詐騙風險',
    '面試時提高警覺，尤其是非正規場所的面試'
  ],
  [ScamType.PAYMENT]: [
    '不要透過非官方管道進行轉帳或付款',
    '不要將信用卡資料提供給不明人士',
    '使用有保障的第三方支付平台',
    '定期檢查銀行對帳單，發現異常立即通報'
  ],
  [ScamType.UNKNOWN]: [
    '與陌生人互動時保持警覺',
    '不要輕易相信網路上的資訊',
    '有疑慮時，先向親友或專業人士諮詢',
    '保護個人隱私，不輕易分享敏感資訊'
  ]
};

/**
 * 分析文本訊息，判斷是否為詐騙訊息
 * @param text 要分析的文本訊息
 * @returns DetectionResult 偵測結果
 */
export const analyzeMessage = (text: string): DetectionResult => {
  if (!text || text.trim() === '') {
    return {
      isScam: false,
      level: WARNING_LEVEL.LOW,
      type: ScamType.UNKNOWN,
      reason: '訊息為空',
      tips: []
    };
  }
  
  // 初始化計數
  const keywordHits: Record<ScamType, { count: number, keywords: string[] }> = {
    [ScamType.INVESTMENT]: { count: 0, keywords: [] },
    [ScamType.SHOPPING]: { count: 0, keywords: [] },
    [ScamType.IMPERSONATION]: { count: 0, keywords: [] },
    [ScamType.PHISHING]: { count: 0, keywords: [] },
    [ScamType.PRIZE]: { count: 0, keywords: [] },
    [ScamType.JOB]: { count: 0, keywords: [] },
    [ScamType.PAYMENT]: { count: 0, keywords: [] },
    [ScamType.UNKNOWN]: { count: 0, keywords: [] }
  };
  
  // 關鍵字檢測
  Object.entries(scamKeywords).forEach(([type, keywords]) => {
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) { // 不區分大小寫進行比對
        keywordHits[type as ScamType].count += 1;
        keywordHits[type as ScamType].keywords.push(keyword);
      }
    });
  });
  
  // 語法模式檢測
  let patternMatchCount = 0;
  let highestLevel: WarningLevel = WARNING_LEVEL.LOW;
  let patternReasons: string[] = [];
  
  scamPatterns.forEach(({ pattern, level, reason }) => {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      patternMatchCount += matches.length;
      patternReasons.push(reason);
      
      // 更新最高警告等級
      if ((level === WARNING_LEVEL.HIGH && highestLevel !== WARNING_LEVEL.HIGH) ||
          (level === WARNING_LEVEL.MEDIUM && highestLevel === WARNING_LEVEL.LOW)) {
        highestLevel = level;
      }
    }
  });
  
  // 確定詐騙類型
  let maxHits = 0;
  let scamType = ScamType.UNKNOWN;
  
  Object.entries(keywordHits).forEach(([type, { count }]) => {
    if (count > maxHits) {
      maxHits = count;
      scamType = type as ScamType;
    }
  });
  
  // 判斷警告等級 - 降低門檻
  let warningLevel: WarningLevel = highestLevel;
  if (maxHits >= 2) { // 從3降至2
    warningLevel = WARNING_LEVEL.HIGH;
  } else if (maxHits >= 1 || patternMatchCount >= 1) { // 從2降至1
    warningLevel = warningLevel === WARNING_LEVEL.HIGH ? WARNING_LEVEL.HIGH : WARNING_LEVEL.MEDIUM;
  }
  
  // 判斷是否為詐騙 - 降低門檻
  // 只要有任何匹配就視為可能的詐騙
  const isScam = maxHits > 0 || patternMatchCount > 0;
  
  // 組合原因
  let reason = '';
  if (maxHits > 0) {
    const keywordsFound = keywordHits[scamType].keywords.join('、');
    reason = `包含可疑關鍵詞：${keywordsFound}`;
  }
  if (patternReasons.length > 0) {
    reason += reason ? '，且' : '';
    reason += patternReasons.join('、');
  }
  
  if (!reason) {
    reason = '訊息看起來正常';
  }
  
  return {
    isScam,
    level: warningLevel,
    type: scamType,
    reason,
    tips: scamTips[scamType]
  };
};

/**
 * 獲取詐騙類型的中文名稱
 * @param type 詐騙類型
 * @returns 詐騙類型的中文名稱
 */
export const getScamTypeName = (type: ScamType): string => {
  const typeNames: Record<ScamType, string> = {
    [ScamType.INVESTMENT]: '投資詐騙',
    [ScamType.SHOPPING]: '購物詐騙',
    [ScamType.IMPERSONATION]: '假冒身分詐騙',
    [ScamType.PHISHING]: '釣魚網站詐騙',
    [ScamType.PRIZE]: '中獎詐騙',
    [ScamType.JOB]: '求職詐騙',
    [ScamType.PAYMENT]: '付款詐騙',
    [ScamType.UNKNOWN]: '未知類型詐騙'
  };
  
  return typeNames[type] || '未知類型詐騙';
};