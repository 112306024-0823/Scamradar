import { Scenario } from './scenarios';

// 新增加的詐騙情境資料
export const newScenarios: Scenario[] = [
  // 網路購物詐騙情境
  {
    id: 'shopping-scam',
    title: '網路購物詐騙',
    description: '你在社群媒體上看到一則超低價限量商品的廣告，賣家聲稱需要先付款才能保留商品。',
    type: '網路購物詐騙',
    difficulty: 'medium',
    tips: [
      '價格明顯低於市價的商品需要特別小心',
      '檢查賣家評價、帳戶成立時間等信息',
      '優先選擇有第三方支付保障的平台購物',
      '避免使用非官方管道或私下交易'
    ],
    conclusion: '網路購物詐騙常利用超低價或限量商品來吸引受害者。正規的購物平台通常有完善的下單流程，不會要求私下轉帳或使用特定支付方式。購物前務必確認賣家的真實性和評價。',
    steps: [
      {
        id: 'step-1',
        showOptions: false,
        messages: [
          {
            id: 'msg-1',
            sender: 'other',
            content: '[廣告] 限量特賣！iPhone 14 Pro Max 全新未拆封，特價只要15,000元！限量5台，售完為止！',
            timestamp: '14:20'
          }
        ]
      },
      {
        id: 'step-2',
        showOptions: true,
        messages: [
          {
            id: 'msg-2',
            sender: 'user',
            content: '這個價格真的嗎？我很有興趣',
            timestamp: '14:25'
          },
          {
            id: 'msg-3',
            sender: 'other',
            content: '真的！這是我朋友從國外帶回來的，因為型號不符合需求，所以特價出售。你要的話需要先付訂金3,000元，我才能幫你保留。',
            timestamp: '14:26'
          }
        ],
        options: [
          {
            id: 'opt-1',
            text: '好的，請告訴我轉帳資訊',
            isCorrect: false,
            feedback: '警告！直接同意匯款是危險的。正規的購物平台有完善的訂單系統，不需要私下轉帳。',
            next: 'step-3-wrong'
          },
          {
            id: 'opt-2',
            text: '我可以見面交易嗎？或者用購物平台下單？',
            isCorrect: true,
            feedback: '很好！要求面交或透過正規平台交易可以降低被騙風險。',
            next: 'step-3-right'
          },
          {
            id: 'opt-3',
            text: '能提供更多商品照片和保固資訊嗎？',
            isCorrect: true,
            feedback: '正確！索取更多資訊有助於判斷商品和賣家的真實性。',
            next: 'step-3-cautious'
          }
        ]
      },
      {
        id: 'step-3-wrong',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-wrong',
            sender: 'other',
            content: '轉帳到這個帳戶：銀行代碼012，帳號1234567890，戶名王某某。轉完後請拍收據給我。',
            timestamp: '14:28'
          }
        ]
      },
      {
        id: 'step-3-right',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-right',
            sender: 'other',
            content: '不好意思，我人在國外無法面交，也不用平台賣，太麻煩了。如果你想買，只能先轉訂金。',
            timestamp: '14:28'
          }
        ]
      },
      {
        id: 'step-3-cautious',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-cautious',
            sender: 'other',
            content: '我等下再拍給你，但手機很搶手，你需要先付訂金才能保留，不然等下被別人買走就沒了。',
            timestamp: '14:28'
          }
        ]
      },
      {
        id: 'step-4',
        showOptions: true,
        messages: [
          {
            id: 'msg-5',
            sender: 'other',
            content: '不然這樣好了，你先付一半的錢，我收到後馬上寄出，你收到後再付另一半，這樣可以嗎？',
            timestamp: '14:30'
          }
        ],
        options: [
          {
            id: 'opt-4',
            text: '好，這樣我比較放心，我現在就匯款',
            isCorrect: false,
            feedback: '這仍然是詐騙！分期付款的建議同樣存在風險，尤其是在沒有第三方保障的情況下。',
            next: 'step-5-wrong'
          },
          {
            id: 'opt-5',
            text: '不用了，我對這個交易方式有疑慮，謝謝',
            isCorrect: true,
            feedback: '做得好！當賣家一直拒絕安全的交易方式並催促付款時，最好的選擇就是拒絕交易。',
            next: 'step-5-right'
          },
          {
            id: 'opt-6',
            text: '我想再查查這個型號的市場價格',
            isCorrect: true,
            feedback: '很聰明！核實商品的市場價格可以幫助判斷是否為詐騙。明顯低於市價的商品通常存在風險。',
            next: 'step-5-research'
          }
        ]
      },
      {
        id: 'step-5-wrong',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-6-wrong',
            sender: 'other',
            content: '好的，謝謝你的信任！請盡快匯款，我等下會傳送運送資訊給你。',
            timestamp: '14:32'
          }
        ]
      },
      {
        id: 'step-5-right',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-6-right',
            sender: 'other',
            content: '算了，不買就不買，浪費我時間！',
            timestamp: '14:32'
          }
        ]
      },
      {
        id: 'step-5-research',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-6-research',
            sender: 'other',
            content: '你再考慮太久就被別人買走了，我這邊還有很多人問，不買拉倒！',
            timestamp: '14:32'
          }
        ]
      }
    ]
  },
  
  // 情感交友詐騙
  {
    id: 'romance-scam',
    title: '情感交友詐騙',
    description: '你在社交軟體上認識了一位自稱是外籍商人的異性，對方熱情地與你互動，並很快表達了強烈的感情。',
    type: '情感交友詐騙',
    difficulty: 'hard',
    tips: [
      '警惕短時間內就表達強烈感情的網友',
      '對方若無法視訊或拒絕面對面見面可能有問題',
      '注意對方是否頻繁談論金錢或投資話題',
      '驗證對方的身分和工作背景',
      '不要因為感情沖昏頭而匯款給網友'
    ],
    conclusion: '情感詐騙者利用人們對愛和陪伴的需求，建立虛假的情感連結，然後以各種理由要求金錢援助。這類詐騙通常發展緩慢，讓被害人在不知不覺中被情感操控，最終失去金錢甚至個人資料。',
    steps: [
      {
        id: 'step-1',
        showOptions: false,
        messages: [
          {
            id: 'msg-1',
            sender: 'other',
            content: '你好！我剛看到你的個人頁面，覺得你很特別，可以認識一下嗎？',
            timestamp: '20:10'
          }
        ]
      },
      {
        id: 'step-2',
        showOptions: true,
        messages: [
          {
            id: 'msg-2',
            sender: 'user',
            content: '你好，謝謝你的讚美，你是？',
            timestamp: '20:12'
          },
          {
            id: 'msg-3',
            sender: 'other',
            content: '我叫Mike，是來自美國的商人，目前在亞洲做生意。我很喜歡台灣，覺得這裡的人很友善！你的笑容真的很美，讓我忍不住想認識你。',
            timestamp: '20:14'
          }
        ],
        options: [
          {
            id: 'opt-1',
            text: '謝謝你的誇獎，很高興認識你！你來台灣多久了？',
            isCorrect: false,
            feedback: '雖然保持友善是好事，但對於突然搭訕且過度奉承的陌生人應該保持警惕。',
            next: 'step-3-friendly'
          },
          {
            id: 'opt-2',
            text: '你是怎麼找到我的帳號的？我們有共同朋友嗎？',
            isCorrect: true,
            feedback: '很好！詢問對方如何找到你以及你們的社交連結是建立基本信任的重要步驟。',
            next: 'step-3-cautious'
          },
          {
            id: 'opt-3',
            text: '不好意思，我不習慣和陌生人聊天',
            isCorrect: true,
            feedback: '謹慎對待網上陌生人的態度是正確的，尤其是當對方主動搭訕並給予過度讚美時。',
            next: 'step-3-decline'
          }
        ]
      },
      {
        id: 'step-3-friendly',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-friendly',
            sender: 'other',
            content: '我斷斷續續來台灣已經快一年了，主要是做進出口貿易。真的很開心能認識你，我覺得我們之間有種特別的連結，雖然才剛認識，但感覺像認識很久了。',
            timestamp: '20:16'
          }
        ]
      },
      {
        id: 'step-3-cautious',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-cautious',
            sender: 'other',
            content: '我是透過推薦系統看到你的，我們沒有共同好友。但我對你的照片印象非常深刻，感覺你是個很有內涵的人。我知道這有點突然，但我真的很想認識你。',
            timestamp: '20:16'
          }
        ]
      },
      {
        id: 'step-3-decline',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-decline',
            sender: 'other',
            content: '我完全理解你的謹慎，這是對的。但我保證我沒有惡意，只是真心想認識你。或許我們可以聊一聊，如果你感到不舒服，隨時可以停止。',
            timestamp: '20:16'
          }
        ]
      },
      {
        id: 'step-4',
        showOptions: true,
        messages: [
          {
            id: 'msg-5',
            sender: 'other',
            content: '對了，我想問問你，你平常會投資嗎？我最近在做一個非常有潛力的投資項目，收益相當可觀，我想和特別的人分享這個機會。',
            timestamp: '20:20'
          }
        ],
        options: [
          {
            id: 'opt-4',
            text: '我對投資有點興趣，你可以多告訴我一些嗎？',
            isCorrect: false,
            feedback: '警告！才剛認識就談論投資機會是情感詐騙的典型手法。對此類話題應保持高度警惕。',
            next: 'step-5-interested'
          },
          {
            id: 'opt-5',
            text: '我們才剛認識，談這個不太合適吧？',
            isCorrect: true,
            feedback: '做得好！認識不久就談論金錢或投資是重大警訊，你的警覺性很高。',
            next: 'step-5-reject'
          },
          {
            id: 'opt-6',
            text: '我不太懂投資，也沒有多餘的錢可以投資',
            isCorrect: true,
            feedback: '這是個安全的回應。表明自己沒有投資能力可以避免詐騙者繼續推銷。',
            next: 'step-5-poor'
          }
        ]
      },
      {
        id: 'step-5-interested',
        showOptions: false,
        messages: [
          {
            id: 'msg-6-interested',
            sender: 'other',
            content: '太好了！這是一個加密貨幣的投資機會，現在入場正是時候。我可以幫你操作，只需要投入一些資金，回報率至少有30%。你願意投入多少？5萬起步就可以了。',
            timestamp: '20:22'
          }
        ]
      },
      {
        id: 'step-5-reject',
        showOptions: false,
        messages: [
          {
            id: 'msg-6-reject',
            sender: 'other',
            content: '我了解你的顧慮，但這真的是個難得的機會，我不希望你錯過。我對你有好感，所以才特別告訴你的。如果你不想錯過，至少投入一點試試看？',
            timestamp: '20:22'
          }
        ]
      },
      {
        id: 'step-5-poor',
        showOptions: false,
        messages: [
          {
            id: 'msg-6-poor',
            sender: 'other',
            content: '沒關係，其實不需要很多錢，1-2萬就可以開始了。我可以指導你，很快你就能賺到更多！這是我對你的特別照顧，不會害你的。',
            timestamp: '20:22'
          }
        ]
      },
      {
        id: 'step-6',
        showOptions: true,
        messages: [
          {
            id: 'msg-7',
            sender: 'other',
            content: '真的，我對你有種特別的感覺，希望能幫助你。這個投資機會真的很好，我已經賺了不少。信任我，好嗎？',
            timestamp: '20:24'
          }
        ],
        options: [
          {
            id: 'opt-7',
            text: '好吧，我可以投資看看，請告訴我要轉帳到哪裡',
            isCorrect: false,
            feedback: '非常危險！這是典型的情感詐騙手法，利用虛假的感情和高回報承諾騙取金錢。',
            next: 'step-7-scammed'
          },
          {
            id: 'opt-8',
            text: '我們可以視訊通話嗎？我想更了解你和這個投資',
            isCorrect: true,
            feedback: '聰明的做法！要求視訊通話可以驗證對方身分，詐騙者通常會拒絕或找藉口推託。',
            next: 'step-7-video'
          },
          {
            id: 'opt-9',
            text: '抱歉，我不感興趣，請不要再談論投資的事了',
            isCorrect: true,
            feedback: '這是最安全的做法！明確拒絕並設立界線可以有效阻止詐騙者。',
            next: 'step-7-block'
          }
        ]
      },
      {
        id: 'step-7-scammed',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-8-scammed',
            sender: 'other',
            content: '太好了！請轉帳到這個銀行帳戶：Bank of America, 帳號324xxxxxxx，戶名Michael Smith。轉完後請告訴我，我會馬上幫你設置帳號。',
            timestamp: '20:26'
          }
        ]
      },
      {
        id: 'step-7-video',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-8-video',
            sender: 'other',
            content: '現在不太方便視訊，我這邊網路不太好，而且我正在開會。不過投資機會隨時會結束，你最好現在就決定，不要錯過這個難得的機會。',
            timestamp: '20:26'
          }
        ]
      },
      {
        id: 'step-7-block',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-8-block',
            sender: 'other',
            content: '你這樣讓我很失望，我是真心對你好，想幫助你賺錢的。算了，你不信任我，那就算了。希望你不要後悔錯過這個機會。',
            timestamp: '20:26'
          }
        ]
      }
    ]
  },
  
  // AI 換臉詐騙
  {
    id: 'deepfake-scam',
    title: 'AI 換臉詐騙',
    description: '你收到一個聲稱來自好友的通訊軟體訊息，但對方的行為舉止有些異常，並要求你幫忙處理一些個人事務。',
    type: 'AI 詐騙',
    difficulty: 'hard',
    tips: [
      '注意朋友突然改變溝通平台或使用新帳號的情況',
      '謹慎對待任何涉及金錢或個人資訊的請求',
      '多管道確認對方身分，如直接打電話',
      '留意對方語氣、用詞是否與平常不同',
      '有疑慮時提出只有真正的朋友才知道的問題'
    ],
    conclusion: 'AI 換臉和語音克隆技術日益精進，詐騙者可能利用這些技術冒充你認識的人。保持警覺，並採取多重管道驗證對方身分是防範此類詐騙的關鍵。',
    steps: [
      {
        id: 'step-1',
        showOptions: false,
        messages: [
          {
            id: 'msg-1',
            sender: 'other',
            content: '嘿，是我啊，小美。我手機壞了，這是我的新帳號。',
            timestamp: '18:15'
          }
        ]
      },
      {
        id: 'step-2',
        showOptions: true,
        messages: [
          {
            id: 'msg-2',
            sender: 'user',
            content: '小美？發生什麼事了？',
            timestamp: '18:17'
          },
          {
            id: 'msg-3',
            sender: 'other',
            content: '對啊，我手機不小心掉到水裡了，現在用備用機，但之前的帳號登不進去，所以用新帳號聯絡你。',
            timestamp: '18:18'
          }
        ],
        options: [
          {
            id: 'opt-1',
            text: '真不幸，需要我幫什麼忙嗎？',
            isCorrect: false,
            feedback: '直接提供幫助前，應該先確認對方身份。這可能是詐騙者冒充你的朋友。',
            next: 'step-3-help'
          },
          {
            id: 'opt-2',
            text: '我可以打電話給你確認一下嗎？',
            isCorrect: true,
            feedback: '很好！透過電話確認是驗證朋友身份的好方法，AI詐騙者通常會拒絕或找藉口。',
            next: 'step-3-call'
          },
          {
            id: 'opt-3',
            text: '你還記得我們上次見面是什麼時候嗎？',
            isCorrect: true,
            feedback: '聰明的做法！詢問只有真正朋友會知道的資訊可以幫助識別詐騙者。',
            next: 'step-3-question'
          }
        ]
      },
      {
        id: 'step-3-help',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-help',
            sender: 'other',
            content: '謝謝你！我現在有點急事，需要處理一筆帳款，但我的網銀登不進去。你能先幫我轉3萬塊給一個客戶嗎？我明天就還你。',
            timestamp: '18:20'
          }
        ]
      },
      {
        id: 'step-3-call',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-call',
            sender: 'other',
            content: '呃...現在不太方便講電話，我在開會。真的是我啦，我待會傳一張照片給你。',
            timestamp: '18:20'
          }
        ]
      },
      {
        id: 'step-3-question',
        showOptions: false,
        messages: [
          {
            id: 'msg-4-question',
            sender: 'other',
            content: '當然記得啊，就上個月在那家新開的餐廳啊！對吧？',
            timestamp: '18:20'
          }
        ]
      },
      {
        id: 'step-4',
        showOptions: true,
        messages: [
          {
            id: 'msg-5',
            sender: 'other',
            content: '[傳送照片] 你看，是我啊！所以你能幫我這個忙嗎？我需要你幫我轉3萬塊到這個帳戶：銀行代碼013，帳號987654321，戶名張某某。',
            timestamp: '18:22'
          }
        ],
        options: [
          {
            id: 'opt-4',
            text: '好的，我現在就轉帳給你',
            isCorrect: false,
            feedback: '這很危險！即使收到照片，也可能是AI生成或P圖。任何要求轉帳的突然請求都應謹慎處理。',
            next: 'step-5-transfer'
          },
          {
            id: 'opt-5',
            text: '我還是不放心，我會直接聯絡小美本人確認',
            isCorrect: true,
            feedback: '做得好！最安全的方法是通過你已知的聯絡方式（如原本的社交媒體帳號或電話）聯絡朋友確認。',
            next: 'step-5-contact'
          },
          {
            id: 'opt-6',
            text: '我們可以視訊通話嗎？我想確認是你',
            isCorrect: true,
            feedback: '很聰明！要求視訊通話可以幫助識別AI換臉詐騙，因為即時視訊中的細節更難造假。',
            next: 'step-5-video'
          }
        ]
      },
      {
        id: 'step-5-transfer',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-6-transfer',
            sender: 'other',
            content: '謝謝你！你是我最好的朋友。轉完後請把收據截圖給我，這樣我才能確認款項。',
            timestamp: '18:24'
          }
        ]
      },
      {
        id: 'step-5-contact',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-6-contact',
            sender: 'other',
            content: '等等，不用那麼麻煩啦！我真的很急需這筆錢，你不相信我嗎？我們認識這麼久了...',
            timestamp: '18:24'
          }
        ]
      },
      {
        id: 'step-5-video',
        showOptions: false,
        isEnd: true,
        messages: [
          {
            id: 'msg-6-video',
            sender: 'other',
            content: '抱歉，我現在在公共場合，不方便視訊。真的很急，你就幫幫忙吧！',
            timestamp: '18:24'
          }
        ]
      }
    ]
  }
];

// 移除getAllScenarios函數，由scenarios.ts來負責合併
// export const getAllScenarios = (): Scenario[] => {
//   // 從原始的scenarios.ts導入原有情境
//   const { scenarios } = require('./scenarios');
//   return [...scenarios, ...newScenarios];
// }; 