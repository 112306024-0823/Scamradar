import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Alert,
  Grid,
  Snackbar,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';

import { useAppContext } from '../contexts/AppContext';

// 平台選項類型
interface PlatformOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const PermissionSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { authorizedPlatforms, setAuthorizedPlatforms, isPremium, setIsPremium, setCurrentPage } = useAppContext();
  
  // 本地狀態
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  // 平台選項
  const platforms: PlatformOption[] = [
    { id: 'line', name: 'Line', description: '台灣最常用的即時通訊軟體', icon: '📱' },
    { id: 'messenger', name: 'Facebook Messenger', description: '社群平台即時通訊', icon: '💬' },
    { id: 'instagram', name: 'Instagram Direct', description: '圖片社群即時訊息', icon: '📸' },
    { id: 'discord', name: 'Discord', description: '社群語音文字平台', icon: '🎮' },
    { id: 'dcard', name: 'Dcard', description: '匿名社群論壇', icon: '🔍' },
    { id: 'sms', name: '簡訊', description: '所有簡訊應用程式', icon: '✉️' }
  ];

  // 當選擇方案變更時，重置選擇的平台
  useEffect(() => {
    setSelectedPlatforms([]);
    setShowAlert(false);
  }, [selectedPlan]);

  // 處理平台勾選
  const handlePlatformChange = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      // 移除平台
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
      setShowAlert(false);
    } else {
      // 檢查免費版限制
      if (selectedPlan === 'free' && selectedPlatforms.length >= 1) {
        setShowAlert(true);
        return;
      }
      
      // 新增平台
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  // 處理方案變更
  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.value as 'free' | 'premium');
  };

  // 處理開始模擬
  const handleStartSimulation = () => {
    if (selectedPlatforms.length === 0) {
      setSnackbarOpen(true);
      return;
    }
    
    // 更新全局狀態
    setAuthorizedPlatforms(selectedPlatforms);
    setIsPremium(selectedPlan === 'premium');
    setCurrentPage('chat');
    
    // 顯示完成訊息後導航到主畫面
    setSnackbarOpen(true);
    setTimeout(() => {
      navigate('/chat');
    }, 1500);
  };

  // 關閉提示
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 5,
      background: 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)'
    }}>
      <Container maxWidth="md">
        <Paper sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4,
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <SecurityIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              權限設定
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            為了提供完整的防詐保護，ScamRadar 需要您的授權才能存取您的通訊平台。
            請選擇您要啟用的平台：
          </Typography>
          
          {/* 方案選擇 */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 2 }}>
                請選擇您的方案：
              </FormLabel>
              <RadioGroup
                name="plan"
                value={selectedPlan}
                onChange={handlePlanChange}
              >
                <FormControlLabel 
                  value="free" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        免費版 - 選擇一個平台
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        限制僅能監控一個通訊平台
                      </Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="premium" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        付費版 - 無限制平台
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        可監控所有通訊平台，提供完整保護
                      </Typography>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
          </Paper>
          
          {/* 平台選擇 */}
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            請選擇要啟用的平台：
          </Typography>
          
          {showAlert && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              免費版僅能選擇一個平台。如需更多平台，請升級至付費版。
            </Alert>
          )}
          
                    <Grid container spacing={2}>            {platforms.map((platform) => (              <Grid size={{ xs: 12, sm: 6 }} key={platform.id}>                <Paper                   elevation={2}                   sx={{                     p: 2,                     borderRadius: 2,                    cursor: 'pointer',                    transition: 'all 0.2s',                    border: selectedPlatforms.includes(platform.id)                       ? `2px solid ${theme.palette.primary.main}`                       : '2px solid transparent',                    '&:hover': {                      bgcolor: 'rgba(140, 82, 255, 0.1)'                    }                  }}                  onClick={() => handlePlatformChange(platform.id)}                >                  <FormControlLabel                    control={                      <Checkbox                         checked={selectedPlatforms.includes(platform.id)}                        onChange={() => handlePlatformChange(platform.id)}                        disabled={selectedPlan === 'free' && selectedPlatforms.length >= 1 && !selectedPlatforms.includes(platform.id)}                      />                    }                    label={                      <Box>                        <Typography>                          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{platform.icon}</span>                          {platform.name}                        </Typography>                        <Typography variant="body2" color="text.secondary">                          {platform.description}                        </Typography>                      </Box>                    }                    sx={{ width: '100%', m: 0 }}                  />                </Paper>              </Grid>            ))}          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartSimulation}
              sx={{ 
                py: 1.5, 
                px: 4,
                fontSize: '1rem'
              }}
            >
              開始模擬
            </Button>
          </Box>
        </Paper>
      </Container>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="權限已設定完成！"
      />
    </Box>
  );
};

export default PermissionSetupPage; 