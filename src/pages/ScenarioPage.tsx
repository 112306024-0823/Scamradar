import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Avatar,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import { useAppContext } from '../contexts/AppContext';
import { getScenarioById, getStepById, getInitialStep, Message, Step, Option } from '../utils/scenarios';

const ScenarioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addCompletedScenario, setCurrentPage } = useAppContext();
  
  // 本地狀態
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [tipsDialogOpen, setTipsDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  
  // 獲取情境資料
  useEffect(() => {
    if (id) {
      const scenario = getScenarioById(id);
      
      if (scenario) {
        const initialStep = getInitialStep(scenario);
        setCurrentStep(initialStep);
      } else {
        // 情境不存在，返回教育頁面
        navigate('/education');
      }
    }
  }, [id, navigate]);
  
  // 步驟切換時，將訊息加入 allMessages
  useEffect(() => {
    if (currentStep && currentStep.messages) {
      setAllMessages(prev => [...prev, ...currentStep.messages.filter(m => !prev.some(pm => pm.id === m.id))]);
    }
  }, [currentStep]);
  
  // 完成時自動跳轉到個人分析頁
  useEffect(() => {
    if (completionDialogOpen && id) {
      const timer = setTimeout(() => {
        navigate(`/scenario/${id}/completion`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [completionDialogOpen, id, navigate]);
  
  // 處理選項選擇
  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setFeedback(option.feedback);
    setIsCorrect(option.isCorrect);
    
    // 延遲一下再切換到下一步
    setTimeout(() => {
      if (option.next) {
        const scenario = getScenarioById(id || '');
        if (scenario) {
          const nextStep = getStepById(scenario, option.next);
          
          if (nextStep) {
            setCurrentStep(nextStep);
            setSelectedOption(null);
            setFeedback(null);
            setIsCorrect(null);
            
            // 如果是最後一步，標記為已完成並顯示完成對話框
            if (nextStep.isEnd) {
              if (id) {
                addCompletedScenario(id);
              }
              setCompletionDialogOpen(true);
            }
          }
        }
      }
    }, 2000);
  };
  
  // 處理自由輸入送出
  const handleUserInputSend = () => {
    if (!userInput.trim() || !currentStep) return;
    // 1. 將用戶輸入訊息顯示在訊息區
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    // 2. 比對現有選項
    let matchedOption: Option | undefined;
    if (currentStep.options) {
      matchedOption = currentStep.options.find(opt =>
        userInput.trim() === opt.text.trim() ||
        opt.text.includes(userInput.trim()) ||
        userInput.trim().includes(opt.text.trim())
      );
    }
    // 3. 若 match，走該分支；否則顯示預設回饋
    if (matchedOption) {
      handleSelectOption(matchedOption);
    } else {
      setFeedback('請嘗試更明確的回覆，或參考上方建議。');
      setIsCorrect(false);
      setSelectedOption(null);
      // 2秒後清除回饋
      setTimeout(() => {
        setFeedback(null);
        setIsCorrect(null);
      }, 2000);
    }
    // 4. 清空 userInput
    setUserInput('');
    // 將用戶訊息加入訊息區（只顯示，不影響劇情分支）
    setCurrentStep(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMsg]
    } : prev);
    // 在 handleUserInputSend 內，將 userMsg 也 push 到 allMessages
    setAllMessages(prev => [...prev, userMsg]);
  };
  
  // 返回教育頁面
  const handleBackToEducation = () => {
    setCurrentPage('education');
    navigate('/education');
  };
  
  // 關閉完成對話框
  const handleCloseCompletionDialog = () => {
    setCompletionDialogOpen(false);
  };
  
  // 切換提示對話框
  const toggleTipsDialog = () => {
    setTipsDialogOpen(!tipsDialogOpen);
  };
  
  // 獲取當前情境
  const scenario = id ? getScenarioById(id) : null;
  
  // 處理「下一步」
  const handleNextStep = () => {
    if (!currentStep || !scenario) return;
    // 找到目前步驟在 scenario.steps 的 index
    const idx = scenario!.steps.findIndex(s => s.id === currentStep.id);
    if (idx >= 0 && idx < scenario!.steps.length - 1) {
      setCurrentStep(scenario!.steps[idx + 1]);
    }
  };
  
  if (!scenario) {
    return null; // 或顯示載入中的介面
  }
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
      py: 3
    }}>
      <Container maxWidth="md">
        {/* 頁頭部分 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToEducation}
            sx={{ mr: 2 }}
          >
            返回
          </Button>
          <Typography variant="h5" component="h1">
            {scenario.title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="outlined" 
            startIcon={<EmojiObjectsIcon />}
            onClick={toggleTipsDialog}
            size="small"
          >
            提示
          </Button>
        </Box>
        
        {/* 情境描述 */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            情境說明
          </Typography>
          <Typography variant="body1" paragraph>
            {scenario.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`類型: ${scenario.type}`} size="small" />
            <Chip label={`難度: ${scenario.difficulty}`} size="small" />
          </Box>
        </Paper>
        
        {/* 聊天模擬區域 */}
        <Paper sx={{ p: 0, mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          {/* 聊天介面頂部 */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Avatar 
              sx={{ mr: 2 }}
              src="https://i.pravatar.cc/150?img=1"
            />
            <Typography variant="subtitle1">
              {scenario.id.includes('investment') ? '王財富顧問' : 
               scenario.id.includes('impersonation') ? '小明（新帳號）' : 
               '陌生聯絡人'}
            </Typography>
          </Box>
          
          {/* 訊息區域 */}
          <Box sx={{ 
            p: 2, 
            maxHeight: '400px', 
            overflowY: 'auto',
            bgcolor: '#f8fafd'
          }}>
            {allMessages.map((message: Message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {message.timestamp}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {/* 選項區域 */}
          {currentStep && currentStep.showOptions && currentStep.options && (
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                請選擇你的回應：
              </Typography>
              <Grid container spacing={2}>
                {currentStep.options.map((option) => (
                  <Grid size={12} key={option.id}>
                    <Button
                      fullWidth
                      variant={selectedOption?.id === option.id ? 'contained' : 'outlined'}
                      onClick={() => handleSelectOption(option)}
                      disabled={selectedOption !== null}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        p: 1.5,
                        borderColor: selectedOption?.id === option.id ?
                          (isCorrect ? 'success.main' : 'error.main') :
                          'divider',
                        bgcolor: selectedOption?.id === option.id ?
                          (isCorrect ? 'success.dark' : 'error.dark') :
                          'transparent'
                      }}
                    >
                      {option.text}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              {/* 自由輸入區塊 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="請輸入你的回覆..."
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleUserInputSend(); }}
                  disabled={selectedOption !== null}
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleUserInputSend}
                  disabled={!userInput.trim() || selectedOption !== null}
                >
                  送出
                </Button>
              </Box>
              {feedback && (
                <Paper sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: isCorrect ? 'success.dark' : 'error.dark',
                  color: 'white',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {isCorrect ? (
                      <CheckCircleIcon sx={{ mr: 1 }} />
                    ) : (
                      <CancelIcon sx={{ mr: 1 }} />
                    )}
                    <Typography variant="subtitle1">
                      {isCorrect ? '做得好！' : '小心！'}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {feedback}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
          {/* 沒有選項時顯示「下一步」按鈕 */}
          {currentStep && !currentStep.showOptions && !currentStep.isEnd && (
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
              <Button variant="contained" onClick={handleNextStep}>下一步</Button>
            </Box>
          )}
        </Paper>
      </Container>
      
      {/* 情境完成對話框 */}
      <Dialog
        open={completionDialogOpen}
        onClose={handleCloseCompletionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            情境完成！
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            學習重點
          </Typography>
          <Typography variant="body1" paragraph>
            {scenario.conclusion}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            防詐小技巧：
          </Typography>
          <List>
            {scenario.tips.map((tip, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              handleCloseCompletionDialog();
              handleBackToEducation();
            }} 
            variant="contained"
          >
            返回教育頁面
          </Button>
          <Button 
            onClick={() => {
              handleCloseCompletionDialog();
              navigate(`/scenario/${id}/completion`);
            }}
            variant="outlined"
            color="primary"
          >
            查看個人分析
          </Button>
          <Button 
            onClick={handleCloseCompletionDialog} 
            variant="text"
          >
            關閉
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 提示對話框 */}
      <Dialog
        open={tipsDialogOpen}
        onClose={toggleTipsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            防詐提示
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List>
            {scenario.tips.map((tip, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleTipsDialog} variant="contained">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScenarioPage; 