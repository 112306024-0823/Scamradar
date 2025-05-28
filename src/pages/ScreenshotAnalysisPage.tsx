import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadIcon from '@mui/icons-material/Upload';
import ImageIcon from '@mui/icons-material/Image';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useAppContext } from '../contexts/AppContext';

// 詐騙類型
enum ScamType {
  FINANCIAL = '金融詐騙',
  INVESTMENT = '投資詐騙',
  IMPERSONATION = '冒充詐騙',
  SHOPPING = '購物詐騙',
  ROMANCE = '感情詐騙',
  LOTTERY = '中獎詐騙',
  PHISHING = '釣魚詐騙',
  OTHER = '其他詐騙'
}

// 風險等級
enum RiskLevel {
  HIGH = '高風險',
  MEDIUM = '中風險',
  LOW = '低風險',
  SAFE = '安全'
}

// 分析結果類型
interface AnalysisResult {
  isScam: boolean;
  probability: number;
  riskLevel: RiskLevel;
  scamType: ScamType | null;
  warningPoints: string[];
  safetyTips: string[];
  analyzedText: string | null;
  analysisTime: string;
}

const ScreenshotAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { screenshotData, setCurrentPage } = useAppContext();
  
  // 狀態
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [imagePreviewDialogOpen, setImagePreviewDialogOpen] = useState(false);
  
  // 從上下文中獲取截圖數據
  useEffect(() => {
    if (screenshotData) {
      setUploadedImage(screenshotData);
      startAnalysis(screenshotData);
    }
  }, [screenshotData]);
  
  // 上傳圖片處理
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setUploadedImage(e.target.result);
          startAnalysis(e.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
    
    setUploadDialogOpen(false);
  };
  
  // 開始分析
  const startAnalysis = (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    // 模擬分析過程，實際場景中這裡應該調用API
    setTimeout(() => {
      try {
        // 隨機模擬不同分析結果
        const random = Math.random();
        let result: AnalysisResult;
        
        if (random > 0.75) {
          // 高風險
          result = {
            isScam: true,
            probability: 85 + Math.random() * 15, // 85-100%
            riskLevel: RiskLevel.HIGH,
            scamType: ScamType.INVESTMENT,
            warningPoints: [
              '文字中包含高報酬承諾',
              '使用緊急和限時手法引導行動',
              '要求提供個人或金融資訊',
              '使用不明的連結或檔案',
              '聲稱無風險的投資機會'
            ],
            safetyTips: [
              '永遠不要點擊可疑連結',
              '不要透露個人金融資訊',
              '向官方管道確認資訊真實性',
              '諮詢專業金融顧問',
              '向反詐騙專線165舉報'
            ],
            analyzedText: '投資金額從10萬起，每月保證有15-20%的穩定回報！比銀行利息高太多了！',
            analysisTime: new Date().toLocaleString()
          };
        } else if (random > 0.4) {
          // 中風險
          result = {
            isScam: true,
            probability: 60 + Math.random() * 25, // 60-85%
            riskLevel: RiskLevel.MEDIUM,
            scamType: ScamType.IMPERSONATION,
            warningPoints: [
              '冒充您認識的人或組織',
              '使用急迫的語氣',
              '要求提供個人資訊',
              '語言或表達方式不自然'
            ],
            safetyTips: [
              '透過其他管道確認對方身份',
              '檢查使用的帳號或電子郵件是否與平時使用的相同',
              '不要提供個人或財務資訊',
              '向相關平台或組織舉報可疑行為'
            ],
            analyzedText: '我是小明，這是我的新帳號。我手機壞了，舊的LINE帳號登不進去了。',
            analysisTime: new Date().toLocaleString()
          };
        } else if (random > 0.15) {
          // 低風險
          result = {
            isScam: false,
            probability: 30 + Math.random() * 30, // 30-60%
            riskLevel: RiskLevel.LOW,
            scamType: null,
            warningPoints: [
              '含有某些可疑元素但不足以判定為詐騙',
              '使用較為模糊的表達方式'
            ],
            safetyTips: [
              '保持警覺，不要輕易提供個人資訊',
              '如有疑問，請向相關單位確認',
              '避免點擊未經驗證的連結'
            ],
            analyzedText: '您好，感謝您對我們產品的關注，請問您有任何疑問嗎？',
            analysisTime: new Date().toLocaleString()
          };
        } else {
          // 安全
          result = {
            isScam: false,
            probability: Math.random() * 30, // 0-30%
            riskLevel: RiskLevel.SAFE,
            scamType: null,
            warningPoints: [],
            safetyTips: [
              '繼續保持警覺',
              '定期更新您的密碼',
              '使用雙重認證增加帳號安全性'
            ],
            analyzedText: '好的，我會準時參加週日的聚會，謝謝你的邀請！',
            analysisTime: new Date().toLocaleString()
          };
        }
        
        setAnalysisResult(result);
        setIsAnalyzing(false);
      } catch (error) {
        setError('分析過程中出現錯誤，請重試。');
        setIsAnalyzing(false);
      }
    }, 3000); // 模擬3秒的分析時間
  };
  
  // 取得風險等級顏色
  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH:
        return theme.palette.error.main;
      case RiskLevel.MEDIUM:
        return theme.palette.warning.main;
      case RiskLevel.LOW:
        return theme.palette.info.main;
      case RiskLevel.SAFE:
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // 重新分析
  const handleReanalyze = () => {
    if (uploadedImage) {
      startAnalysis(uploadedImage);
    }
  };
  
  // 返回聊天模擬頁面
  const handleBack = () => {
    setCurrentPage('chat');
    navigate('/chat');
  };
  
  // 顯示上傳對話框
  const handleShowUploadDialog = () => {
    setUploadDialogOpen(true);
  };
  
  // 關閉上傳對話框
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };
  
  // 顯示圖片預覽對話框
  const handleShowImagePreview = () => {
    setImagePreviewDialogOpen(true);
  };
  
  // 關閉圖片預覽對話框
  const handleCloseImagePreview = () => {
    setImagePreviewDialogOpen(false);
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f4f6fb 0%, #e9eafc 100%)',
      py: 3
    }}>
      <Container maxWidth="lg">
        {/* 頁頭部分 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            返回
          </Button>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <CameraAltIcon sx={{ mr: 1 }} />
            截圖詐騙分析
          </Typography>
        </Box>
        
        {/* 主要內容區域 */}
        <Grid container spacing={3}>
          {/* 左側：上傳區域和圖片預覽 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                上傳截圖
              </Typography>
              
              <Box sx={{ textAlign: 'center', my: 2 }}>
                {uploadedImage ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={uploadedImage}
                      alt="uploaded screenshot"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                      onClick={handleShowImagePreview}
                    />
                    <Tooltip title="查看大圖">
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                        }}
                        onClick={handleShowImagePreview}
                      >
                        <ImageIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={handleShowUploadDialog}
                  >
                    <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      點擊上傳截圖
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      支援 JPG、PNG 格式
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                fullWidth
                onClick={handleShowUploadDialog}
                sx={{ mt: 2 }}
              >
                {uploadedImage ? '上傳新截圖' : '上傳截圖'}
              </Button>
              
              {uploadedImage && (
                <Button
                  variant="outlined"
                  startIcon={<AssessmentIcon />}
                  fullWidth
                  onClick={handleReanalyze}
                  sx={{ mt: 2 }}
                  disabled={isAnalyzing}
                >
                  重新分析
                </Button>
              )}
            </Paper>
            
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                如何使用
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <Typography variant="body1" fontWeight="bold">1.</Typography>
                  </ListItemIcon>
                  <ListItemText primary="上傳您收到的可疑訊息截圖" />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <Typography variant="body1" fontWeight="bold">2.</Typography>
                  </ListItemIcon>
                  <ListItemText primary="系統會自動分析截圖內容" />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <Typography variant="body1" fontWeight="bold">3.</Typography>
                  </ListItemIcon>
                  <ListItemText primary="查看詐騙風險評估和安全建議" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <Typography variant="body1" fontWeight="bold">4.</Typography>
                  </ListItemIcon>
                  <ListItemText primary="使用提供的安全建議保護自己" />
                </ListItem>
              </List>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  提示：可以直接從 ScamRadar 的聊天模擬中截圖，或上傳您實際收到的可疑訊息。
                </Typography>
              </Alert>
            </Paper>
          </Grid>
          
          {/* 右側：分析結果 */}
          <Grid size={{ xs: 12, md: 8 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {isAnalyzing ? (
              <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  正在分析截圖...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  系統正在對您的截圖進行詐騙風險分析，這可能需要幾秒鐘時間。
                </Typography>
                <LinearProgress sx={{ mt: 3 }} />
              </Paper>
            ) : analysisResult ? (
              <Box>
                {/* 分析結果摘要卡片 */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 2,
                    border: `2px solid ${getRiskLevelColor(analysisResult.riskLevel)}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: getRiskLevelColor(analysisResult.riskLevel),
                        color: 'white',
                        mr: 2
                      }}
                    >
                      {analysisResult.riskLevel === RiskLevel.HIGH && <ErrorIcon fontSize="large" />}
                      {analysisResult.riskLevel === RiskLevel.MEDIUM && <WarningIcon fontSize="large" />}
                      {analysisResult.riskLevel === RiskLevel.LOW && <InfoIcon fontSize="large" />}
                      {analysisResult.riskLevel === RiskLevel.SAFE && <CheckCircleIcon fontSize="large" />}
                    </Box>
                    <Box>
                      <Typography variant="h5" gutterBottom sx={{ color: getRiskLevelColor(analysisResult.riskLevel) }}>
                        {analysisResult.riskLevel}
                      </Typography>
                      <Typography variant="body1">
                        {analysisResult.isScam ? '這很可能是詐騙訊息！' : '這可能不是詐騙訊息。'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      ml: 'auto', 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'background.paper' 
                    }}>
                      <Typography variant="h3" sx={{ color: getRiskLevelColor(analysisResult.riskLevel), fontWeight: 'bold' }}>
                        {Math.round(analysisResult.probability)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        詐騙可能性
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        分析時間
                      </Typography>
                      <Typography variant="body2">
                        {analysisResult.analysisTime}
                      </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        詐騙類型
                      </Typography>
                      <Typography variant="body2">
                        {analysisResult.scamType || '未檢測到明確詐騙類型'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Grid container spacing={3}>
                  {/* 左側：風險點 */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        風險因素
                      </Typography>
                      {analysisResult.warningPoints.length > 0 ? (
                        <List>
                          {analysisResult.warningPoints.map((point, index) => (
                            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                              <ListItemIcon sx={{ minWidth: '36px' }}>
                                <WarningIcon 
                                  color={analysisResult.riskLevel === RiskLevel.HIGH ? 'error' : 'warning'} 
                                />
                              </ListItemIcon>
                              <ListItemText primary={point} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          未檢測到明顯風險因素
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                  
                  {/* 右側：安全建議 */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        安全建議
                      </Typography>
                      <List>
                        {analysisResult.safetyTips.map((tip, index) => (
                          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: '36px' }}>
                              <SecurityIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* 分析的文字內容 */}
                {analysisResult.analyzedText && (
                  <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      分析的內容
                    </Typography>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{analysisResult.analyzedText}"
                      </Typography>
                    </Paper>
                  </Paper>
                )}
                
                {/* 行動按鈕 */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleReanalyze}
                    startIcon={<AssessmentIcon />}
                  >
                    重新分析
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleBack}
                  >
                    返回聊天
                  </Button>
                </Box>
              </Box>
            ) : (
              <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                <CameraAltIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  尚未上傳截圖
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  請上傳您想要分析的聊天截圖，系統將自動檢測其中可能存在的詐騙風險。
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={handleShowUploadDialog}
                  sx={{ mt: 2 }}
                >
                  上傳截圖
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
      
      {/* 上傳對話框 */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleCloseUploadDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          上傳截圖
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            請選擇您要上傳的聊天截圖，支援JPG、PNG格式。
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            選擇圖片
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
              hidden
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>取消</Button>
        </DialogActions>
      </Dialog>
      
      {/* 圖片預覽對話框 */}
      <Dialog
        open={imagePreviewDialogOpen}
        onClose={handleCloseImagePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">截圖預覽</Typography>
          <IconButton onClick={handleCloseImagePreview} edge="end">
            <InfoIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {uploadedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={uploadedImage} 
                alt="截圖預覽" 
                style={{ maxWidth: '100%', maxHeight: '70vh' }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImagePreview}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScreenshotAnalysisPage; 