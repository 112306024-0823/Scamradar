import { Scenario } from './scenarios';

// 風險類型定義
export enum RiskType {
  FINANCIAL_INVESTMENT = '金融投資高風險型',
  EMOTIONAL_FRIENDSHIP = '情感交友高風險型',
  ONLINE_SHOPPING = '網路購物高風險型',
  PERSONAL_INFO_LEAK = '個資洩漏高風險型',
  IMPULSIVE_DECISION = '衝動決策型',
  AUTHORITY_COMPLIANCE = '權威服從型',
  INFO_TRUST = '資訊輕信型',
  TECH_INDIFFERENCE = '科技冷漠型'
}

// 風險等級定義
export enum RiskLevel {
  HIGH = '高風險',
  MEDIUM = '中風險',
  LOW = '低風險'
}

// 用戶行為模式分析面向
export interface BehaviorAnalysis {
  reactionTime: number; // 反應時間評分 (1-10)
  errorRate: number; // 錯誤率評分 (1-10)
  impulsiveness: number; // 衝動程度評分 (1-10)
  compliance: number; // 服從性評分 (1-10)
  infoDisclosure: number; // 資訊揭露傾向評分 (1-10)
  stressTolerance: number; // 壓力耐受度評分 (1-10)
}

// 風險類型標籤分數
export interface RiskTypeScores {
  [RiskType.FINANCIAL_INVESTMENT]: number;
  [RiskType.EMOTIONAL_FRIENDSHIP]: number;
  [RiskType.ONLINE_SHOPPING]: number;
  [RiskType.PERSONAL_INFO_LEAK]: number;
  [RiskType.IMPULSIVE_DECISION]: number;
  [RiskType.AUTHORITY_COMPLIANCE]: number;
  [RiskType.INFO_TRUST]: number;
  [RiskType.TECH_INDIFFERENCE]: number;
}

// 用戶風險報告
export interface RiskReport {
  overallRiskLevel: RiskLevel;
  topRiskTypes: RiskType[]; // 1-3個最符合用戶的風險類型
  behaviorAnalysis: BehaviorAnalysis;
  scenarioResults: {
    scenarioId: string;
    scenarioTitle: string;
    correctChoices: number;
    totalChoices: number;
    performance: number; // 0-100分
  }[];
  recommendations: string[]; // 個人化防詐建議
  learningResources: {
    title: string;
    description: string;
    link: string;
  }[];
  riskTypeScores: RiskTypeScores;
}

// 全國統計數據（模擬資料）
export const NATIONAL_STATISTICS = {
  financialScamRate: 0.64, // 64% 的人曾遭遇金融投資詐騙
  emotionalScamRate: 0.58, // 58% 的人曾遭遇情感詐騙
  shoppingScamRate: 0.72, // 72% 的人曾遭遇網購詐騙
  personalInfoLeakRate: 0.45, // 45% 的人曾洩漏個人資料
  averageRiskLevel: {
    high: 0.35, // 35% 的人屬於高風險
    medium: 0.45, // 45% 的人屬於中風險
    low: 0.20 // 20% 的人屬於低風險
  },
  avgPerformanceScore: 62 // 全國平均表現分數
};

// 計算用戶相較於全國統計數據的差異百分比
export const calculateStatisticsComparison = (report: RiskReport): {
  betterThanPercentage: number;
  riskTypeComparison: Record<RiskType, number>;
} => {
  // 計算用戶平均表現
  const userAvgPerformance = report.scenarioResults.reduce(
    (sum, result) => sum + result.performance, 
    0
  ) / (report.scenarioResults.length || 1);
  
  // 計算用戶比全國平均表現好多少百分比
  const betterThanPercentage = userAvgPerformance > NATIONAL_STATISTICS.avgPerformanceScore
    ? Math.round(((userAvgPerformance - NATIONAL_STATISTICS.avgPerformanceScore) / NATIONAL_STATISTICS.avgPerformanceScore) * 100)
    : 0;
  
  // 計算用戶風險類型與全國數據的比較
  const riskTypeComparison: Record<RiskType, number> = {
    [RiskType.FINANCIAL_INVESTMENT]: calculateRiskComparison(report, RiskType.FINANCIAL_INVESTMENT, NATIONAL_STATISTICS.financialScamRate),
    [RiskType.EMOTIONAL_FRIENDSHIP]: calculateRiskComparison(report, RiskType.EMOTIONAL_FRIENDSHIP, NATIONAL_STATISTICS.emotionalScamRate),
    [RiskType.ONLINE_SHOPPING]: calculateRiskComparison(report, RiskType.ONLINE_SHOPPING, NATIONAL_STATISTICS.shoppingScamRate),
    [RiskType.PERSONAL_INFO_LEAK]: calculateRiskComparison(report, RiskType.PERSONAL_INFO_LEAK, NATIONAL_STATISTICS.personalInfoLeakRate),
    [RiskType.IMPULSIVE_DECISION]: -15, // 固定值，表示比平均低15%
    [RiskType.AUTHORITY_COMPLIANCE]: -5, // 固定值，表示比平均低5%
    [RiskType.INFO_TRUST]: 10, // 固定值，表示比平均高10%
    [RiskType.TECH_INDIFFERENCE]: -20, // 固定值，表示比平均低20%
  };
  
  return {
    betterThanPercentage,
    riskTypeComparison
  };
};

// 輔助函數：計算特定風險類型的比較
const calculateRiskComparison = (report: RiskReport, riskType: RiskType, nationalRate: number): number => {
  // 檢查用戶是否有這種風險類型
  const hasRiskType = report.topRiskTypes.includes(riskType);
  // 如果用戶有此風險類型，則風險高於平均 10-30%，否則低於平均 10-30%
  return hasRiskType 
    ? Math.round(Math.random() * 20) + 10 
    : -1 * (Math.round(Math.random() * 20) + 10);
};

// 分析用戶在情境中的選擇，生成風險報告
export const generateRiskReport = (
  userChoices: { scenarioId: string; optionIds: string[] }[],
  scenarios: Scenario[]
): RiskReport => {
  // 初始化風險類型分數
  const riskTypeScores: RiskTypeScores = {
    [RiskType.FINANCIAL_INVESTMENT]: 0,
    [RiskType.EMOTIONAL_FRIENDSHIP]: 0,
    [RiskType.ONLINE_SHOPPING]: 0,
    [RiskType.PERSONAL_INFO_LEAK]: 0,
    [RiskType.IMPULSIVE_DECISION]: 0,
    [RiskType.AUTHORITY_COMPLIANCE]: 0,
    [RiskType.INFO_TRUST]: 0,
    [RiskType.TECH_INDIFFERENCE]: 0
  };

  // 初始化情境結果
  const scenarioResults: RiskReport['scenarioResults'] = [];
  
  // 初始化行為分析數據
  const behaviorAnalysis: BehaviorAnalysis = {
    reactionTime: 5,
    errorRate: 5,
    impulsiveness: 5,
    compliance: 5,
    infoDisclosure: 5,
    stressTolerance: 5
  };
  
  // 分析每個情境中的選擇
  userChoices.forEach(userChoice => {
    const scenario = scenarios.find(s => s.id === userChoice.scenarioId);
    if (!scenario) return;
    
    let correctChoices = 0;
    let totalChoices = 0;
    
    // 根據情境類型更新風險類型分數
    if (scenario.type.includes('投資')) {
      riskTypeScores[RiskType.FINANCIAL_INVESTMENT] += 2;
      riskTypeScores[RiskType.AUTHORITY_COMPLIANCE] += 1;
    } else if (scenario.type.includes('身分') || scenario.type.includes('交友')) {
      riskTypeScores[RiskType.EMOTIONAL_FRIENDSHIP] += 2;
      riskTypeScores[RiskType.INFO_TRUST] += 1;
    } else if (scenario.type.includes('購物')) {
      riskTypeScores[RiskType.ONLINE_SHOPPING] += 2;
      riskTypeScores[RiskType.IMPULSIVE_DECISION] += 1;
    }
    
    // 計算正確選擇數和總選擇數
    userChoice.optionIds.forEach(optionId => {
      let foundOption = false;
      scenario.steps.forEach(step => {
        if (!step.options) return;
        
        const option = step.options.find(opt => opt.id === optionId);
        if (option) {
          foundOption = true;
          totalChoices++;
          if (option.isCorrect) {
            correctChoices++;
          } else {
            // 根據錯誤選擇調整風險類型分數
            if (option.text.includes('好') || option.text.includes('可以') || option.text.includes('幫')) {
              riskTypeScores[RiskType.IMPULSIVE_DECISION] += 1;
              riskTypeScores[RiskType.INFO_TRUST] += 1;
              behaviorAnalysis.impulsiveness += 1;
            }
            if (option.text.includes('轉帳') || option.text.includes('匯款') || option.text.includes('付款')) {
              riskTypeScores[RiskType.FINANCIAL_INVESTMENT] += 1;
              behaviorAnalysis.compliance += 1;
            }
            if (option.text.includes('資訊') || option.text.includes('個人') || option.text.includes('資料')) {
              riskTypeScores[RiskType.PERSONAL_INFO_LEAK] += 1;
              behaviorAnalysis.infoDisclosure += 1;
            }
          }
        }
      });
      
      if (!foundOption) {
        totalChoices++;
      }
    });
    
    // 計算表現分數
    const performance = totalChoices > 0 ? (correctChoices / totalChoices) * 100 : 0;
    
    // 添加情境結果
    scenarioResults.push({
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      correctChoices,
      totalChoices,
      performance
    });
  });
  
  // 計算整體風險等級
  const averagePerformance = scenarioResults.reduce((sum, result) => sum + result.performance, 0) / 
                           (scenarioResults.length || 1);
  
  let overallRiskLevel = RiskLevel.MEDIUM;
  if (averagePerformance >= 75) {
    overallRiskLevel = RiskLevel.LOW;
  } else if (averagePerformance < 50) {
    overallRiskLevel = RiskLevel.HIGH;
  }
  
  // 獲取前三大風險類型
  const sortedRiskTypes = Object.entries(riskTypeScores)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type as RiskType)
    .slice(0, 3);
  
  // 生成個人化建議
  const recommendations: string[] = [];
  
  if (sortedRiskTypes.includes(RiskType.FINANCIAL_INVESTMENT)) {
    recommendations.push('對於投資機會，請始終保持懷疑態度，查證業者合法性，避免高報酬承諾。');
  }
  if (sortedRiskTypes.includes(RiskType.EMOTIONAL_FRIENDSHIP)) {
    recommendations.push('與陌生人交流時，避免過早分享個人資訊，並警惕情感操控手法。');
  }
  if (sortedRiskTypes.includes(RiskType.IMPULSIVE_DECISION)) {
    recommendations.push('面對緊急要求，請給自己時間思考，諮詢親友或專業人士意見後再行動。');
  }
  if (sortedRiskTypes.includes(RiskType.AUTHORITY_COMPLIANCE)) {
    recommendations.push('有人宣稱來自權威機構時，請通過官方管道驗證其身分，不要輕信。');
  }
  if (sortedRiskTypes.includes(RiskType.PERSONAL_INFO_LEAK)) {
    recommendations.push('加強各平台的帳戶安全設定，啟用雙重驗證，定期變更密碼。');
  }
  
  // 學習資源
  const learningResources = [
    {
      title: '辨識詐騙的15個警訊',
      description: '詳細解說常見詐騙手法的警訊與辨識方法',
      link: '/resources/scam-signals'
    },
    {
      title: '保護個人資訊安全指南',
      description: '如何在網路上保護自己的個人資料',
      link: '/resources/personal-info-security'
    },
    {
      title: '網路投資詐騙防範守則',
      description: '避免落入投資詐騙陷阱的實用建議',
      link: '/resources/investment-scam-prevention'
    }
  ];
  
  return {
    overallRiskLevel,
    topRiskTypes: sortedRiskTypes,
    behaviorAnalysis,
    scenarioResults,
    recommendations,
    learningResources,
    riskTypeScores
  };
};

// 產生個人化詐騙者語錄
export const generateScammerQuotes = (riskTypes: RiskType[]): string[] => {
  const quotes: string[] = [];
  
  if (riskTypes.includes(RiskType.FINANCIAL_INVESTMENT)) {
    quotes.push('「這是限時的機會，投資金額從10萬起，每月保證有15-20%的穩定回報！」');
    quotes.push('「我們有內部消息，這支股票下週一定會大漲，現在買入絕對賺！」');
  }
  
  if (riskTypes.includes(RiskType.EMOTIONAL_FRIENDSHIP)) {
    quotes.push('「我的手機壞了，這是我的新帳號，可以先借我5000元應急嗎？」');
    quotes.push('「我們聊了這麼久，你難道不信任我嗎？」');
  }
  
  if (riskTypes.includes(RiskType.ONLINE_SHOPPING)) {
    quotes.push('「現在下單還有額外9折優惠，但名額只剩3個！」');
    quotes.push('「這是限量商品，請先付款預訂，否則將被取消資格。」');
  }
  
  if (riskTypes.includes(RiskType.AUTHORITY_COMPLIANCE)) {
    quotes.push('「這裡是刑事警察局，你的帳戶已被凍結，請立即提供你的銀行資訊以協助調查。」');
    quotes.push('「我是稅務局人員，你有一筆稅款未繳，請立即匯款到指定帳戶。」');
  }
  
  // 確保至少有2個語錄
  if (quotes.length < 2) {
    quotes.push('「這個機會錯過就沒有了，現在必須立即決定！」');
    quotes.push('「不要告訴別人，這是只給你的特別優惠。」');
  }
  
  return quotes;
};

// 產生個人化防詐小提示
export const generateScamTips = (riskLevel: RiskLevel): string[] => {
  const baseTips = [
    '合法機構不會要求你提供完整的身分證號碼、密碼或信用卡資訊',
    '遇到可疑訊息，先與親友討論或撥打165防詐騙專線',
    '不要輕信陌生人提供的投資機會，特別是高報酬、低風險的承諾'
  ];
  
  if (riskLevel === RiskLevel.HIGH) {
    return [
      ...baseTips,
      '設定「24小時反悔期」：重大決定至少思考24小時後再行動',
      '建立「詐騙警報網」：指定1-2位值得信任的親友，遇到可疑情況時諮詢',
      '啟用所有帳戶的雙重驗證功能，提升帳戶安全性'
    ];
  } else if (riskLevel === RiskLevel.MEDIUM) {
    return [
      ...baseTips,
      '定期更新密碼，不同平台使用不同密碼',
      '不要因為急迫感而忽略警訊，詐騙者常製造緊急情境'
    ];
  } else {
    return baseTips;
  }
}; 