// 互動教育情境資料

// 定義對話訊息類型
export interface Message {
  id: string;
  sender: 'user' | 'other';
  content: string;
  timestamp: string;
}

// 定義選項類型
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  next?: string; // 下一個訊息或情境的 ID
}

// 定義情境中的步驟類型
export interface Step {
  id: string;
  messages: Message[];
  options?: Option[];
  showOptions: boolean;
  isEnd?: boolean;
}

// 定義完整情境類型
export interface Scenario {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: Step[];
  tips: string[];
  conclusion: string;
}

// 創建模擬情境資料
export const scenarios: Scenario[] = [
  // 投資詐騙情境
  {
    id: 'investment-scam',
    title: '假投資詐騙',
    description: '一個陌生人透過社群媒體聯繫你，宣稱有高回報的投資機會。',
    type: '投資詐騙',
    difficulty: 'medium',
    tips: [
      '合法投資機會不會保證獲利或高回報',
      '投資前應查詢業者是否有合法執照',
      '避免投資過高風險或不熟悉的投資標的',
      '拒絕來路不明的投資建議'
    ],
    conclusion: '投資詐騙常利用高報酬的誘惑，讓被害人放下戒心。合法的投資機會不會保證獲利，也不會要求私下轉帳或使用特殊支付方式。保持警覺，拒絕來路不明的投資建議。',
    steps: [
      {
        id: 'step-1',
        showOptions: false,
        messages: [
          {
            id: 'msg-1',
            sender: 'other',
            content: '你好！我是金融投資顧問王先生，很高興認識你！',
            timestamp: '10:30'
          }
        ]
      },
      {
        id: 'step-2',
        showOptions: false,
        messages: [
          {
            id: 'msg-2',
            sender: 'other',
            content: '我目前正在招募少數精英投資者，參與一個高回報低風險的投資計劃。',
            timestamp: '10:31'
          }
        ]
      },
      {
        id: 'step-3',
        showOptions: false,
        messages: [
          {
            id: 'msg-3',
            sender: 'other',
            content: '這是一個限時的機會，投資金額從10萬起，每月保證有15-20%的穩定回報！比銀行利息高太多了！',
            timestamp: '10:33'
          }
        ]
      },
      {
        id: 'step-4',
        showOptions: true,
        messages: [
          {
            id: 'msg-4',
            sender: 'other',
            content: '你有興趣參與嗎？我可以私下告訴你更多詳情。',
            timestamp: '10:34'
          }
        ],
        options: [
          {
            id: 'opt-1',
            text: '聽起來不錯！請告訴我更多資訊',
            isCorrect: false,
            feedback: '要小心！「保證回報」和「比銀行利息高太多」是投資詐騙的常見話術。合法的投資從不保證獲利。',
            next: 'step-5-wrong'
          },
          {
            id: 'opt-2',
            text: '你代表哪家公司？可以提供公司官網和執照資訊嗎？',
            isCorrect: true,
            feedback: '很好！詢問對方的身分和公司資訊是正確的做法。合法的金融顧問應該能夠提供這些資訊。',
            next: 'step-5-right'
          },
          {
            id: 'opt-3',
            text: '我需要考慮一下，先幫我保留名額',
            isCorrect: false,
            feedback: '雖然沒有立即接受，但「保留名額」的心態顯示你已經被騙子的話術所吸引。要完全拒絕此類可疑提議。',
            next: 'step-5-neutral'
          }
        ]
      },
      {
        id: 'step-5-wrong',
        showOptions: false,
        messages: [
          {
            id: 'msg-5-wrong',
            sender: 'other',
            content: '太好了！這個機會真的很難得。我們需要你先支付5000元的入會費，之後就可以參與我們的VIP投資群組。請提供你的銀行帳號，我們會安排專人與你聯繫。',
            timestamp: '10:36'
          }
        ]
      },
      {
        id: 'step-5-right',
        showOptions: false,
        messages: [
          {
            id: 'msg-5-right',
            sender: 'other',
            content: '這個...其實我們是私人投資團隊，不方便透露太多資訊。但我可以保證這是真實的機會！',
            timestamp: '10:36'
          }
        ]
      },
      {
        id: 'step-5-neutral',
        showOptions: false,
        messages: [
          {
            id: 'msg-5-neutral',
            sender: 'other',
            content: '當然可以，但名額有限，今天內必須決定。如果你現在就決定，我還可以給你額外2%的回報！',
            timestamp: '10:36'
          }
        ]
      },
      {
        id: 'step-6',
        showOptions: true,
        messages: [
          {
            id: 'msg-6',
            sender: 'other',
            content: '不要錯過這個千載難逢的機會！現在就加入，讓你的錢為你工作！',
            timestamp: '10:38'
          }
        ],
        options: [
          {
            id: 'opt-4',
            text: '好的，我會考慮轉帳',
            isCorrect: false,
            feedback: '糟糕！這是詐騙。合法投資不會要求先付入會費，也不會催促你立即決定。',
            next: 'step-7-wrong'
          },
          {
            id: 'opt-5',
            text: '這聽起來像是詐騙，我不會參與',
            isCorrect: true,
            feedback: '做得好！這確實是詐騙。你識破了他們的把戲。',
            next: 'step-7-right'
          },
          {
            id: 'opt-6',
            text: '我需要諮詢家人和專業的財務顧問',
            isCorrect: true,
            feedback: '很明智的決定！諮詢專業人士和家人是避免落入詐騙陷阱的好方法。',
            next: 'step-7-wise'
          }
        ]
      },
      {
        id: 'step-7-wrong',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-7-wrong',
            sender: 'other',
            content: '明智的選擇！請盡快完成轉帳，我會立即將你加入VIP投資群組。',
            timestamp: '10:40'
          }
        ]
      },
      {
        id: 'step-7-right',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-7-right',
            sender: 'other',
            content: '你錯過了大好機會！你會後悔的！',
            timestamp: '10:40'
          }
        ]
      },
      {
        id: 'step-7-wise',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-7-wise',
            sender: 'other',
            content: '不需要那麼麻煩，這是內部機會，越多人知道越不利於你。今天下午5點前必須決定！',
            timestamp: '10:40'
          }
        ]
      }
    ]
  },
  
  // 假冒親友詐騙
  {
    id: 'impersonation-scam',
    title: '假冒親友詐騙',
    description: '一個自稱是你朋友的人透過通訊軟體聯繫你，表示有緊急情況需要金錢幫助。',
    type: '假冒身分詐騙',
    difficulty: 'easy',
    tips: [
      '親友突然透過新帳號聯繫並要求金錢援助時要特別小心',
      '可透過電話或其他管道直接確認親友的身分',
      '注意對方的語氣和用詞是否與真實親友一致',
      '不要急著匯款，先確認對方身分'
    ],
    conclusion: '詐騙者經常假冒親友，製造緊急情境要求金錢援助。面對此類情況，應該直接透過平常使用的聯絡方式與親友確認，不要輕易相信訊息內容。',
    steps: [
      {
        id: 'step-1',
        showOptions: false,
        messages: [
          {
            id: 'msg-1',
            sender: 'other',
            content: '嗨！我是小明，這是我的新帳號。',
            timestamp: '15:20'
          }
        ]
      },
      {
        id: 'step-2',
        showOptions: true,
        messages: [
          {
            id: 'msg-2',
            sender: 'other',
            content: '我手機壞了，剛用新號碼辦的門號，舊的LINE帳號登不進去了。',
            timestamp: '15:21'
          }
        ],
        options: [
          {
            id: 'opt-1',
            text: '嗨小明！什麼事啊？',
            isCorrect: false,
            feedback: '不應該直接相信對方的身分。應該先透過其他管道確認。',
            next: 'step-3-wrong'
          },
          {
            id: 'opt-2',
            text: '你是哪個小明？我認識好幾個小明。',
            isCorrect: true,
            feedback: '很好！先確認對方究竟是誰，測試他們是否真的認識你。',
            next: 'step-3-right'
          },
          {
            id: 'opt-3',
            text: '我可以打電話給你確認一下嗎？',
            isCorrect: true,
            feedback: '非常好！透過電話確認是防範假冒親友詐騙的好方法。',
            next: 'step-3-best'
          }
        ]
      },
      {
        id: 'step-3-wrong',
        showOptions: false,
        messages: [
          {
            id: 'msg-3-wrong',
            sender: 'other',
            content: '我現在遇到一點急事，需要借5000元應急，等下就還你。你可以幫我先轉帳嗎？',
            timestamp: '15:24'
          }
        ]
      },
      {
        id: 'step-3-right',
        showOptions: false,
        messages: [
          {
            id: 'msg-3-right',
            sender: 'other',
            content: '就是國中同學啊！我們上禮拜才一起吃飯。',
            timestamp: '15:24'
          }
        ]
      },
      {
        id: 'step-3-best',
        showOptions: false,
        messages: [
          {
            id: 'msg-3-best',
            sender: 'other',
            content: '呃...不用了吧！我手機有點問題，暫時打不了電話。',
            timestamp: '15:24'
          }
        ]
      },
      {
        id: 'step-4',
        showOptions: true,
        messages: [
          {
            id: 'msg-4',
            sender: 'other',
            content: '其實我現在急需一筆錢，可以借我5000元嗎？我很快就會還你的。',
            timestamp: '15:25'
          }
        ],
        options: [
          {
            id: 'opt-4',
            text: '好啊，我等等就轉給你',
            isCorrect: false,
            feedback: '這是詐騙！不要輕易相信突然要求金錢的訊息，即使看起來像是認識的人。',
            next: 'step-5-wrong'
          },
          {
            id: 'opt-5',
            text: '我想先跟你視訊或是直接聯絡你的家人確認',
            isCorrect: true,
            feedback: '做得好！視訊是確認對方身分的有效方法，詐騙者通常會拒絕視訊。',
            next: 'step-5-right'
          },
          {
            id: 'opt-6',
            text: '我可以幫忙，但需要知道具體是什麼急事',
            isCorrect: false,
            feedback: '詢問詳情是好的，但這仍可能讓你落入陷阱。詐騙者擅長編造理由。',
            next: 'step-5-neutral'
          }
        ]
      },
      {
        id: 'step-5-wrong',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-5-wrong',
            sender: 'other',
            content: '謝謝你！請轉到這個帳戶: 0123456789，戶名: 張某某。轉完請傳收據給我。',
            timestamp: '15:26'
          }
        ]
      },
      {
        id: 'step-5-right',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-5-right',
            sender: 'other',
            content: '我現在沒辦法視訊...算了，我問問其他人好了。',
            timestamp: '15:26'
          }
        ]
      },
      {
        id: 'step-5-neutral',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-5-neutral',
            sender: 'other',
            content: '我的錢包和手機一起弄丟了，現在急需錢坐車回家。拜託幫幫我！',
            timestamp: '15:26'
          }
        ]
      }
    ]
  }
];

// 獲取特定情境
export const getScenarioById = (id: string): Scenario | undefined => {
  // 使用getAllScenarios函數獲取所有情境（包括新增的）
  const allScenarios = getAllScenarios();
  return allScenarios.find(scenario => scenario.id === id);
};

// 獲取所有情境
export const getAllScenarios = (): Scenario[] => {
  // 如果newScenarios模塊存在，則合併情境
  try {
    const { newScenarios } = require('./newScenarios');
    return [...scenarios, ...newScenarios];
  } catch (e) {
    // 如果newScenarios模塊不存在，則只返回原始情境
    return scenarios;
  }
};

// 獲取情境的初始步驟
export const getInitialStep = (scenario: Scenario): Step => {
  return scenario.steps[0];
};

// 根據步驟 ID 獲取下一步
export const getStepById = (scenario: Scenario, stepId: string): Step | undefined => {
  return scenario.steps.find(step => step.id === stepId);
};