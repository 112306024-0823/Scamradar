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
    }
  }, [currentChat]);
  
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
          responseText = '請點擊這個連結填寫您的資料：http://bit.ly/gift_claim 需要您的姓名、電話、地址、信用卡資訊以便寄送禮物。';
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
        setCurrentWarning(detectionResult);
        setWarningDialogOpen(true);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
          bgcolor: 'background.default',
          overflow: 'hidden'
        }}
        ref={chatContentRef}
      >
        {/* 聊天背景 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            zIndex: 0
          }}
        />
        
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
        
        {/* 訊息區域 */}
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1
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
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', bgcolor: 'error.main', color: 'white' }}>
          <WarningIcon sx={{ mr: 1 }} />
          詐騙警示
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {currentWarning && (
            <>
              <Typography variant="h6" gutterBottom>
                偵測到可能的{getScamTypeName(currentWarning.type)}
              </Typography>
              
              <Typography variant="body1" paragraph>
                系統偵測到此訊息可能包含詐騙內容，請提高警覺！
              </Typography>
              
              <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  可疑原因：
                </Typography>
                <Typography variant="body2">
                  {currentWarning.reason}
                </Typography>
              </Paper>
              
              <Typography variant="subtitle2" gutterBottom>
                防範小技巧：
              </Typography>
              <List disablePadding>
                {currentWarning.tips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <Typography variant="body2">• {tip}</Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleTakeScreenshot}
            startIcon={<ScreenshotIcon />}
          >
            截圖求證
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseWarningDialog}
          >
            我知道了
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
            variant="contained"
            onClick={handleCloseScreenshotDialog}
          >
            關閉
          </Button>
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