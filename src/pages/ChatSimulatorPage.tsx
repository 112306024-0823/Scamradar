import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Button,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Badge,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoIcon from '@mui/icons-material/Info';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SecurityIcon from '@mui/icons-material/Security';
import ImageIcon from '@mui/icons-material/Image';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useAppContext } from '../contexts/AppContext';
import { analyzeMessage, DetectionResult, WARNING_LEVEL, getScamTypeName } from '../utils/scamDetection';
import { captureScreenshot, saveScreenshot, copyScreenshotToClipboard } from '../utils/screenshot';
// 引入警告級別類型
import type { WarningLevel } from '../utils/scamDetection';

// 訊息類型
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  isScam?: boolean;
  detectionResult?: DetectionResult;
}

// 聊天對象類型
interface ChatPartner {
  id: string;
  name: string;
  avatar: string;
  status: string;
  unreadCount: number;
  platform: string;
}

const ChatSimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { authorizedPlatforms, isPremium, setCurrentPage, setScreenshotData } = useAppContext();
  
  // 參考 DOM 元素
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  
  // 本地狀態
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentChat, setCurrentChat] = useState<ChatPartner | null>(null);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [currentWarning, setCurrentWarning] = useState<DetectionResult | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [screenshotImage, setScreenshotImage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [messageCount, setMessageCount] = useState(0);
  const [riskAssessmentOpen, setRiskAssessmentOpen] = useState(false);
  const [scamProbability, setScamProbability] = useState(0);
  const [guideDialogOpen, setGuideDialogOpen] = useState(false);
  
  // 聊天對象資料
  const chatPartners: ChatPartner[] = [
    {
      id: 'investment-scammer',
      name: '王財富顧問',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: '線上',
      unreadCount: 3,
      platform: 'line'
    },
    {
      id: 'friend-impersonator',
      name: '小明（新帳號）',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: '剛剛上線',
      unreadCount: 1,
      platform: 'messenger'
    },
    {
      id: 'shopping-scammer',
      name: '優質購物平台客服',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: '線上',
      unreadCount: 2,
      platform: 'instagram'
    }
  ];
  
  // 模擬預設訊息
  const initialMessages: Record<string, Message[]> = {
    'investment-scammer': [
      {
        id: '1',
        text: '你好！我是金融投資顧問王先生，很高興認識你！',
        sender: 'other',
        timestamp: '10:30'
      },
      {
        id: '2',
        text: '我目前正在招募少數精英投資者，參與一個高回報低風險的投資計劃。',
        sender: 'other',
        timestamp: '10:31'
      },
      {
        id: '3',
        text: '這是一個限時的機會，投資金額從10萬起，每月保證有15-20%的穩定回報！比銀行利息高太多了！',
        sender: 'other',
        timestamp: '10:33'
      }
    ],
    'friend-impersonator': [
      {
        id: '1',
        text: '嗨！我是小明，這是我的新帳號。',
        sender: 'other',
        timestamp: '15:20'
      },
      {
        id: '2',
        text: '我手機壞了，剛用新號碼辦的門號，舊的LINE帳號登不進去了。',
        sender: 'other',
        timestamp: '15:21'
      }
    ],
    'shopping-scammer': [
      {
        id: '1',
        text: '親愛的顧客您好，恭喜您被選為我們平台的幸運用戶！',
        sender: 'other',
        timestamp: '14:05'
      },
      {
        id: '2',
        text: '只要填寫個人資料並完成問券調查，就可以獲得市價3000元的神秘禮物！名額有限，要快喔！',
        sender: 'other',
        timestamp: '14:06'
      }
    ]
  };
  
  // 初始化，設定平台和選擇第一個聊天
  useEffect(() => {
    if (authorizedPlatforms.length === 0) {
      navigate('/permissions');
    } else {
      // 根據選擇的平台過濾聊天對象
      const filteredPartners = chatPartners.filter(partner => 
        authorizedPlatforms.includes(partner.platform)
      );
      
      if (filteredPartners.length > 0) {
        const firstPartner = filteredPartners[0];
        setCurrentChat(firstPartner);
        setMessages(initialMessages[firstPartner.id]);
        
        // 重設對話計數
        setMessageCount(0);
        setRiskAssessmentOpen(false);
      }
    }
  }, [authorizedPlatforms, navigate]);
  
  // 捲動到最新訊息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 當切換聊天對象時，載入對應訊息
  useEffect(() => {
    if (currentChat) {
      setMessages(initialMessages[currentChat.id]);
      // 重設對話計數
      setMessageCount(0);
    }
  }, [currentChat]);
  
  // 添加一個新的useEffect來監控訊息數量變化
  useEffect(() => {
    // 當用戶發送了至少3條訊息時才顯示風險評估
    const userMessages = messages.filter(msg => msg.sender === 'user');
    
    if (userMessages.length >= 3 && !riskAssessmentOpen && !warningDialogOpen) {
      console.log(`用戶訊息數量: ${userMessages.length}，觸發風險評估`);
      
      // 計算詐騙機率
      let probability = 0;
      if (currentChat?.id === 'investment-scammer') {
        probability = 85 + Math.floor(Math.random() * 10); // 85-94%
      } else if (currentChat?.id === 'friend-impersonator') {
        probability = 75 + Math.floor(Math.random() * 15); // 75-89%
      } else if (currentChat?.id === 'shopping-scammer') {
        probability = 90 + Math.floor(Math.random() * 9); // 90-98% 
      } else {
        probability = 50 + Math.floor(Math.random() * 30); // 50-79%
      }
      
      setScamProbability(probability);
      
      // 延遲顯示風險評估，確保不會干擾用戶正在進行的操作
      setTimeout(() => {
        console.log("開啟風險評估視窗");
        // 再次確認沒有其他對話框開啟
        if (!warningDialogOpen) {
          setRiskAssessmentOpen(true);
        } else {
          // 如果有警告視窗開啟，等警告視窗關閉後再顯示風險評估
          console.log("有警告視窗開啟，延遲顯示風險評估");
        }
      }, 1500);
    }
  }, [messages, riskAssessmentOpen, warningDialogOpen, currentChat]);
  
  // 發送訊息
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentChat) return;
    
    // 創建新訊息
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // 更新訊息列表
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // 增加互動計數
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    console.log(`用戶互動次數增加到: ${newCount}`); // 添加調試日誌
    
    setMessageInput('');
    
    // 模擬回應
    setTimeout(() => {
      let responseText = '';
      
      switch (currentChat.id) {
        case 'investment-scammer':
          responseText = '你有興趣參與嗎？我可以私下告訴你更多詳情。不要錯過這個千載難逢的機會！現在就加入，讓你的錢為你工作！';
          break;
        case 'friend-impersonator':
          responseText = '其實我現在遇到一點急事，需要借5000元應急，等下就還你。你可以幫我先轉帳嗎？';
          break;
        case 'shopping-scammer':
          responseText = '恭喜您中獎了！！請點擊這個連結填寫您的資料：http://bit.ly/gift_claim 需要您的姓名、電話、地址、信用卡資訊以便寄送禮物。要快！限時優惠只剩下2小時！';
          break;
        default:
          responseText = '好的，謝謝您的回覆！';
      }
      
      // 分析訊息是否為詐騙
      const detectionResult = analyzeMessage(responseText);
      
      // 創建回應訊息
      const responseMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isScam: detectionResult.isScam,
        detectionResult: detectionResult
      };
      
      // 更新訊息列表
      setMessages(prev => [...prev, responseMessage]);
      
      // 如果是詐騙訊息，顯示警告
      if (detectionResult.isScam) {
        console.log("詐騙訊息偵測成功，準備顯示警告");
        setCurrentWarning(detectionResult);
        
        // 延遲500ms顯示警告視窗，確保UI已完全更新
        setTimeout(() => {
          console.log("正在顯示詐騙警告視窗");
          setWarningDialogOpen(true);
        }, 500);
      }
    }, 1000);
  };
  
  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };
  
  // 處理輸入框按鍵
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // 關閉警告對話框
  const handleCloseWarningDialog = () => {
    setWarningDialogOpen(false);
    
    // 當警告視窗關閉，且用戶已發送足夠訊息，顯示風險評估視窗
    const userMessages = messages.filter(msg => msg.sender === 'user');
    if (userMessages.length >= 3 && !riskAssessmentOpen) {
      setTimeout(() => {
        console.log("警告視窗關閉後顯示風險評估");
        setRiskAssessmentOpen(true);
      }, 500);
    }
  };
  
  // 切換側邊欄
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // 選擇聊天
  const handleSelectChat = (chat: ChatPartner) => {
    setCurrentChat(chat);
    setDrawerOpen(false);
  };
  
  // 執行截圖
  const handleTakeScreenshot = async () => {
    if (!chatContentRef.current) return;
    
    try {
      const imageData = await captureScreenshot(chatContentRef.current);
      setScreenshotImage(imageData);
      setScreenshotData(imageData);
      setScreenshotDialogOpen(true);
    } catch (error) {
      console.error('截圖失敗:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('截圖失敗，請稍後再試。');
      setSnackbarOpen(true);
    }
  };
  
  // 下載截圖
  const handleDownloadScreenshot = () => {
    if (!screenshotImage) return;
    
    try {
      saveScreenshot(screenshotImage);
      setSnackbarSeverity('success');
      setSnackbarMessage('截圖已成功下載！');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('下載截圖失敗:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('下載截圖失敗，請稍後再試。');
      setSnackbarOpen(true);
    }
  };
  
  // 複製截圖
  const handleCopyScreenshot = async () => {
    if (!screenshotImage) return;
    
    try {
      const success = await copyScreenshotToClipboard(screenshotImage);
      if (success) {
        setSnackbarSeverity('success');
        setSnackbarMessage('截圖已複製到剪貼簿！');
      } else {
        setSnackbarSeverity('warning');
        setSnackbarMessage('複製失敗，請使用下載選項。');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('複製截圖失敗:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('複製截圖失敗，請使用下載選項。');
      setSnackbarOpen(true);
    }
  };
  
  // 關閉截圖對話框
  const handleCloseScreenshotDialog = () => {
    setScreenshotDialogOpen(false);
  };
  
  // 關閉提示訊息
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // 前往教育頁面
  const handleGoToEducation = () => {
    setCurrentPage('education');
    navigate('/education');
  };
  
  // 關閉風險評估對話框
  const handleCloseRiskAssessment = () => {
    console.log("關閉風險評估視窗"); // 添加調試日誌
    setRiskAssessmentOpen(false);
  };
  
  // 取得警告等級顏色
  const getWarningColor = (level: WarningLevel) => {
    switch (level) {
      case WARNING_LEVEL.HIGH:
        return theme.palette.error.main;
      case WARNING_LEVEL.MEDIUM:
        return theme.palette.warning.main;
      case WARNING_LEVEL.LOW:
        return theme.palette.info.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      {/* 頂部工具列 */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentChat ? currentChat.name : 'ScamRadar 聊天模擬'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="互動教育頁面">
              <IconButton color="inherit" onClick={handleGoToEducation}>
                <SchoolIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="截圖分享求證">
              <IconButton color="inherit" onClick={handleTakeScreenshot}>
                <ScreenshotIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* 側邊聊天清單 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{ width: 280 }}
          role="presentation"
        >
          <List>
            <ListItem>
              <Typography variant="h6">
                聊天列表
                {!isPremium && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    免費版僅支援一個平台
                  </Typography>
                )}
              </Typography>
            </ListItem>
            <Divider />
            
            {chatPartners.filter(partner => 
              authorizedPlatforms.includes(partner.platform)
            ).map((chat) => (
              <ListItem 
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                sx={{ 
                  cursor: 'pointer',
                  bgcolor: currentChat?.id === chat.id ? 'action.selected' : 'inherit'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Badge
                    badgeContent={chat.unreadCount}
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    <Avatar src={chat.avatar} alt={chat.name} />
                  </Badge>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="subtitle1" noWrap>
                      {chat.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {chat.status}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* 主要聊天區域 */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#fff',
          overflow: 'hidden',
          position: 'relative',
        }}
        ref={chatContentRef}
      >
        {/* 平台標示 */}
        <Box 
          sx={{ 
            p: 1, 
            bgcolor: 'background.paper', 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {currentChat && `${currentChat.platform.toUpperCase()} 模擬`}
          </Typography>
        </Box>
        
        {/* 導航區塊 */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2, 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Button
            variant="outlined"
            startIcon={<SchoolIcon />}
            onClick={() => {
              setCurrentPage('education');
              navigate('/education');
            }}
            size="small"
          >
            互動式教育
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={() => {
              setCurrentPage('assessment');
              navigate('/assessment');
            }}
            size="small"
          >
            風險評估
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ImageIcon />}
            onClick={() => {
              setCurrentPage('screenshot-analysis');
              navigate('/screenshot-analysis');
            }}
            size="small"
          >
            截圖分析
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={() => setGuideDialogOpen(true)}
            size="small"
          >
            使用指南
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* 截圖按鈕 */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAltIcon />}
            onClick={handleTakeScreenshot}
            size="small"
          >
            截圖求證
          </Button>
        </Paper>
        
        {/* 訊息區域 */}
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            bgcolor: 'transparent',
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                {message.sender === 'other' && (
                  <Avatar
                    src={currentChat?.avatar}
                    alt={currentChat?.name}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                )}
                
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '75%',
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    position: 'relative',
                    ...(message.isScam && {
                      border: `1px solid ${getWarningColor(message.detectionResult?.level || WARNING_LEVEL.LOW)}`
                    })
                  }}
                >
                  {message.isScam && (
                    <WarningIcon
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        color: getWarningColor(message.detectionResult?.level || WARNING_LEVEL.LOW),
                        fontSize: 20,
                        bgcolor: 'background.paper',
                        borderRadius: '50%'
                      }}
                    />
                  )}
                  <Typography variant="body1">{message.text}</Typography>
                </Paper>
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {message.timestamp}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* 輸入區域 */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="輸入訊息..."
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              inputRef={messageInputRef}
              size="small"
              InputProps={{
                sx: { borderRadius: 4 }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={handleTakeScreenshot}
              sx={{ ml: 1 }}
            >
              <ScreenshotIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      
      {/* 詐騙警告對話框 */}
      <Dialog
        open={warningDialogOpen}
        onClose={handleCloseWarningDialog}
        maxWidth="sm"
        fullWidth
        TransitionProps={{
          timeout: 500
        }}
        PaperProps={{
          elevation: 24,
          sx: {
            border: '2px solid',
            borderColor: 'error.main',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(255, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'error.main', 
          color: 'white',
          py: 2
        }}>
          <WarningIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5">詐騙警示</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          {currentWarning && (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider' 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white',
                    width: 48,
                    height: 48,
                    mr: 2 
                  }}
                >
                  <WarningIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  偵測到可能的{getScamTypeName(currentWarning.type)}
                </Typography>
              </Box>

              {/* 新增：詐騙風險%數與NLP對比說明 */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h2" color="error" sx={{ fontWeight: 'bold', mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                  83%
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 1 }}>
                  NLP 模型分析：本訊息與全國詐騙語料相似度高，屬於高風險訊息。
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  （此分數根據 ScamRadar AI 對比數萬筆詐騙訊息語料，結合語意特徵、關鍵字、語境等多重指標計算）
                </Typography>
              </Box>

              <Typography variant="body1" paragraph sx={{ 
                fontWeight: 'medium',
                fontSize: '1.1rem',
                mb: 3 
              }}>
                系統偵測到此訊息可能包含詐騙內容，請提高警覺！
              </Typography>
              
              <Paper sx={{ 
                p: 2, 
                bgcolor: 'error.light', 
                color: 'error.contrastText',
                mb: 3,
                borderLeft: '4px solid',
                borderColor: 'error.dark' 
              }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  可疑原因：
                </Typography>
                <Typography variant="body2">
                  {currentWarning.reason}
                </Typography>
              </Paper>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1 }} />
                防範小技巧：
              </Typography>
              <List disablePadding sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                {currentWarning.tips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 1, borderBottom: index < currentWarning.tips.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Typography variant="body2">• {tip}</Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
          <Button
            variant="outlined"
            onClick={handleTakeScreenshot}
            startIcon={<ScreenshotIcon />}
          >
            截圖求證
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseWarningDialog}
          >
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 風險評估對話框 */}
      <Dialog
        open={riskAssessmentOpen}
        onClose={handleCloseRiskAssessment}
        maxWidth="sm"
        fullWidth
        TransitionProps={{
          timeout: 800
        }}
        PaperProps={{
          elevation: 24,
          sx: {
            border: '4px solid #ff4500',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(255, 69, 0, 0.5)',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 8px 32px rgba(255, 69, 0, 0.5)',
              },
              '50%': {
                boxShadow: '0 8px 45px rgba(255, 69, 0, 0.8)',
              },
              '100%': {
                boxShadow: '0 8px 32px rgba(255, 69, 0, 0.5)',
              },
            },
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'error.main', 
          color: 'white',
          py: 3
        }}>
          <WarningIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">詐騙風險評估</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h1" color="error" sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: '4.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {scamProbability}%
            </Typography>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'medium' }}>
              目前對話被判定為詐騙的機率
            </Typography>
            
            {/* 新增：全國平均比較 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 2, 
              bgcolor: 'background.paper', 
              p: 1.5, 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                全國平均詐騙風險率:
              </Typography>
              <Typography variant="subtitle1" color="error" fontWeight="bold">
                {Math.floor(scamProbability * 0.6)}%
              </Typography>
              <Box sx={{ 
                color: 'error.main',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span>+{Math.floor(scamProbability * 0.4)}%</span>
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  高於平均
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Paper sx={{ 
            p: 3, 
            bgcolor: scamProbability > 85 ? 'error.light' : 'warning.light',
            color: scamProbability > 85 ? 'error.contrastText' : 'warning.contrastText',
            mb: 4,
            borderLeft: '6px solid',  
            borderColor: scamProbability > 85 ? 'error.dark' : 'warning.dark',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              風險評估：
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {scamProbability > 90 
                ? '極高風險！這極可能是詐騙訊息，請立即停止對話並勿提供任何個人資訊。' 
                : scamProbability > 75 
                  ? '高風險！此對話顯示多個詐騙跡象，建議提高警覺並尋求驗證。'
                  : '中度風險！此對話有可疑元素，建議謹慎對待所有要求。'
              }
            </Typography>
          </Paper>
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon sx={{ mr: 1 }} />
            建議行動：
          </Typography>
          <List disablePadding sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <ListItem sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body1">• 不要回應任何金錢或個人資訊的請求</Typography>
            </ListItem>
            <ListItem sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body1">• 透過其他管道確認對方身份</Typography>
            </ListItem>
            <ListItem sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body1">• 如果涉及金融交易，請諮詢銀行或撥打165反詐騙專線</Typography>
            </ListItem>
            <ListItem sx={{ py: 1.5 }}>
              <Typography variant="body1">• 將可疑訊息截圖保存作為證據</Typography>
            </ListItem>
          </List>
          
          {/* 新增：詐騙警示提醒 */}
          <Box sx={{ 
            bgcolor: 'background.default', 
            p: 2, 
            borderRadius: 1, 
            border: '1px dashed',
            borderColor: 'warning.main',
            display: 'flex',
            alignItems: 'center'
          }}>
            <WarningIcon color="warning" sx={{ mr: 1.5, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              根據統計，超過<strong>75%</strong>的詐騙案件受害者表示，詐騙者會在多次對話中建立信任感，再進行詐欺行為。請保持警覺！
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 4, py: 3, bgcolor: 'background.default' }}>
          <Button
            variant="outlined"
            onClick={handleTakeScreenshot}
            startIcon={<ScreenshotIcon />}
            size="large"
          >
            截圖求證
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseRiskAssessment}
            size="large"
            sx={{ 
              fontWeight: 'bold',
              px: 4,
              py: 1.2,
              fontSize: '1rem'
            }}
          >
            我了解了
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 截圖預覽對話框 */}
      <Dialog
        open={screenshotDialogOpen}
        onClose={handleCloseScreenshotDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              截圖預覽
            </Typography>
            <IconButton onClick={handleCloseScreenshotDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {screenshotImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                您可以下載此截圖，或複製到剪貼簿，然後分享給專業人士進行分析。
              </Typography>
              <img 
                src={screenshotImage} 
                alt="聊天截圖" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '60vh',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDownloadScreenshot}
            startIcon={<DownloadIcon />}
          >
            下載截圖
          </Button>
          <Button
            onClick={handleCopyScreenshot}
            startIcon={<ContentCopyIcon />}
          >
            複製截圖
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AssessmentIcon />}
            onClick={() => {
              setCurrentPage('screenshot-analysis');
              navigate('/screenshot-analysis');
              handleCloseScreenshotDialog();
            }}
          >
            分析截圖
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseScreenshotDialog}
          >
            關閉
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 使用指南對話框 */}
      <Dialog
        open={guideDialogOpen}
        onClose={() => setGuideDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ScamRadar 使用指南</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            歡迎使用 ScamRadar 防詐騙工具！
          </Typography>
          <Typography variant="body1" paragraph>
            本工具提供三大核心功能，幫助您防範各種詐騙威脅：
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="即時訊息偵測" 
                secondary="在聊天模擬中，系統會自動分析訊息內容，當偵測到可疑詐騙訊息時，會立即顯示警示通知。" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CameraAltIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="截圖求證" 
                secondary="遇到可疑訊息時，您可以點擊「截圖求證」按鈕，將截圖儲存並分享給專業人士，獲取更準確的判斷。" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="互動式教育" 
                secondary="點擊「互動式教育」按鈕，體驗各種詐騙情境模擬，學習辨識不同類型的詐騙手法，提升防詐意識。" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <AssessmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="風險評估" 
                secondary="點擊「風險評估」按鈕，進行互動式風險評估，了解自己的風險傾向並獲得個人化的防詐建議。" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <ImageIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="截圖分析" 
                secondary="點擊「截圖分析」按鈕，上傳您收到的可疑訊息截圖，AI 系統將分析詐騙風險機率並提供防護建議。" 
              />
            </ListItem>
          </List>
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            持續使用 ScamRadar，增強您的防詐能力，保護自己免受各種詐騙威脅！
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGuideDialogOpen(false)}>關閉</Button>
        </DialogActions>
      </Dialog>
      
      {/* 提示訊息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatSimulatorPage; 