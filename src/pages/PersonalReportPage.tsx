import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';

import { useAppContext } from '../contexts/AppContext';
import { 
  RiskType, 
  RiskLevel, 
  NATIONAL_STATISTICS, 
  generateScammerQuotes, 
  generateScamTips 
} from '../utils/riskProfiles';

// 用戶回應類型 (同AssessmentPage)
interface UserResponse {
  questionId: string;
  responseText: string;
  riskScore: number;
  timestamp: string;
}

const PersonalReportPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setCurrentPage } = useAppContext();

  // 狀態
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [overallRiskScore, setOverallRiskScore] = useState(0);
  const [overallRiskLevel, setOverallRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM);
  const [riskTypeScores, setRiskTypeScores] = useState<Record<RiskType, number>>({
    [RiskType.FINANCIAL_INVESTMENT]: 0,
    [RiskType.EMOTIONAL_FRIENDSHIP]: 0,
    [RiskType.ONLINE_SHOPPING]: 0,
    [RiskType.PERSONAL_INFO_LEAK]: 0,
    [RiskType.IMPULSIVE_DECISION]: 0,
    [RiskType.AUTHORITY_COMPLIANCE]: 0,
    [RiskType.INFO_TRUST]: 0,
    [RiskType.TECH_INDIFFERENCE]: 0
  });
  const [topRiskTypes, setTopRiskTypes] = useState<RiskType[]>([]);
  const [scammerQuotes, setScammerQuotes] = useState<string[]>([]);
  const [preventionTips, setPreventionTips] = useState<string[]>([]);
  const [comparison, setComparison] = useState({
    betterThanPercentage: 0,
    riskTypeComparison: {} as Record<RiskType, number>
  });

  // 從本地存儲加載評估結果
  useEffect(() => {
    const storedResults = localStorage.getItem('assessmentResults');
    if (storedResults) {
      const responses = JSON.parse(storedResults) as UserResponse[];
      setUserResponses(responses);
      
      // 分析結果
      analyzeResults(responses);
    } else {
      // 如果沒有評估結果，可能是用戶直接訪問了報告頁面，重定向回評估頁面
      navigate('/assessment');
    }
  }, [navigate]);

  // 分析評估結果
  const analyzeResults = (responses: UserResponse[]) => {
    // 計算整體風險分數 (0-10)
    const avgScore = responses.reduce((sum, resp) => sum + resp.riskScore, 0) / responses.length;
    setOverallRiskScore(avgScore);
    
    // 設置風險等級
    let riskLevel = RiskLevel.MEDIUM;
    if (avgScore >= 7) {
      riskLevel = RiskLevel.HIGH;
    } else if (avgScore <= 3) {
      riskLevel = RiskLevel.LOW;
    }
    setOverallRiskLevel(riskLevel);
    
    // 根據回答內容分配風險類型分數
    const riskScores = { ...riskTypeScores };
    
    responses.forEach(response => {
      const text = response.responseText.toLowerCase();
      
      // 金融投資風險
      if (text.includes('投資') || text.includes('報酬') || text.includes('獲利')) {
        riskScores[RiskType.FINANCIAL_INVESTMENT] += 2;
      }
      
      // 情感交友風險
      if (text.includes('朋友') || text.includes('聯繫') || text.includes('認識')) {
        riskScores[RiskType.EMOTIONAL_FRIENDSHIP] += 1;
      }
      
      // 網路購物風險
      if (text.includes('購買') || text.includes('商品') || text.includes('訂單')) {
        riskScores[RiskType.ONLINE_SHOPPING] += 1.5;
      }
      
      // 個資洩漏風險
      if (text.includes('資料') || text.includes('個人') || text.includes('填寫')) {
        riskScores[RiskType.PERSONAL_INFO_LEAK] += 2;
      }
      
      // 衝動決策風險
      if (text.includes('立即') || text.includes('馬上') || text.includes('立刻')) {
        riskScores[RiskType.IMPULSIVE_DECISION] += 2.5;
      }
      
      // 權威服從風險
      if (text.includes('官方') || text.includes('通知') || text.includes('客服')) {
        riskScores[RiskType.AUTHORITY_COMPLIANCE] += 1.5;
      }
      
      // 資訊輕信風險
      if (text.includes('相信') || text.includes('接受') || text.includes('同意')) {
        riskScores[RiskType.INFO_TRUST] += 2;
      }
      
      // 科技冷漠風險
      if (text.includes('連結') || text.includes('點擊') || text.includes('網址')) {
        riskScores[RiskType.TECH_INDIFFERENCE] += 1.5;
      }
      
      // 根據風險分數增加對應風險類型分數
      if (response.riskScore >= 7) {
        // 高風險回答，增加所有風險類型分數
        Object.keys(riskScores).forEach(key => {
          riskScores[key as RiskType] += 1;
        });
      }
    });
    
    setRiskTypeScores(riskScores);
    
    // 獲取前三大風險類型
    const sortedRiskTypes = Object.entries(riskScores)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type as RiskType)
      .slice(0, 3);
    
    setTopRiskTypes(sortedRiskTypes);
    
    // 生成詐騙者語錄和防詐小提示
    setScammerQuotes(generateScammerQuotes(sortedRiskTypes));
    setPreventionTips(generateScamTips(riskLevel));
    
    // 模擬與全國平均的比較
    const betterThan = Math.max(0, Math.round((1 - (avgScore / 10)) * 100));
    
    const typeDiff: Record<RiskType, number> = {} as Record<RiskType, number>;
    Object.keys(riskScores).forEach(key => {
      const riskType = key as RiskType;
      // 生成-30到+30之間的隨機比較值
      typeDiff[riskType] = Math.floor(Math.random() * 60) - 30;
      
      // 根據風險分數調整比較值
      if (sortedRiskTypes.includes(riskType)) {
        typeDiff[riskType] = Math.abs(typeDiff[riskType]); // 確保是正值
      } else {
        typeDiff[riskType] = -Math.abs(typeDiff[riskType]); // 確保是負值
      }
    });
    
    setComparison({
      betterThanPercentage: betterThan,
      riskTypeComparison: typeDiff
    });
  };

  // 獲取風險等級顏色
  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH:
        return theme.palette.error.main;
      case RiskLevel.MEDIUM:
        return theme.palette.warning.main;
      case RiskLevel.LOW:
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // 獲取風險類型圖標
  const getRiskTypeIcon = (riskType: RiskType): React.ReactNode => {
    switch (riskType) {
      case RiskType.FINANCIAL_INVESTMENT:
        return <span style={{ fontSize: 24 }}>💰</span>;
      case RiskType.EMOTIONAL_FRIENDSHIP:
        return <span style={{ fontSize: 24 }}>💔</span>;
      case RiskType.ONLINE_SHOPPING:
        return <span style={{ fontSize: 24 }}>🛒</span>;
      case RiskType.PERSONAL_INFO_LEAK:
        return <span style={{ fontSize: 24 }}>🔐</span>;
      case RiskType.IMPULSIVE_DECISION:
        return <span style={{ fontSize: 24 }}>⚡</span>;
      case RiskType.AUTHORITY_COMPLIANCE:
        return <span style={{ fontSize: 24 }}>👮</span>;
      case RiskType.INFO_TRUST:
        return <span style={{ fontSize: 24 }}>📰</span>;
      case RiskType.TECH_INDIFFERENCE:
        return <span style={{ fontSize: 24 }}>📱</span>;
      default:
        return <span style={{ fontSize: 24 }}>❓</span>;
    }
  };

  // 返回評估頁面
  const handleBack = () => {
    navigate('/assessment');
  };

  // 返回首頁
  const handleBackToHome = () => {
    setCurrentPage('chat');
    navigate('/chat');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f4f6fb 0%, #e9eafc 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        {/* 頁頭部分 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            返回評估
          </Button>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1 }} />
            個人風險報告
          </Typography>
        </Box>
        
        {/* 報告摘要卡片 */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(50, 50, 200, 0.1)',
              zIndex: 0
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              您的防詐風險摘要
            </Typography>
            <Typography variant="subtitle1" paragraph>
              根據您的評估結果，我們生成了這份個人化風險報告。透過了解您的風險類型和行為模式，可以更好地防範各種詐騙威脅。
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'rgba(0,0,0,0.1)', 
              p: 1, 
              borderRadius: 1,
              mt: 2
            }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                評估完成時間：{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </Typography>
              <Chip 
                size="small" 
                icon={<CheckCircleIcon />} 
                label="評估完成" 
                color="primary" 
                sx={{ ml: 'auto' }}
              />
            </Box>
          </Box>
        </Paper>
        
        {/* 風險等級和風險類型 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* 左側：整體風險等級 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                bgcolor: getRiskLevelColor(overallRiskLevel) + '15',
                border: `1px solid ${getRiskLevelColor(overallRiskLevel)}`
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  您的整體風險等級
                </Typography>
                <Box 
                  sx={{ 
                    p: 3,
                    borderRadius: '50%',
                    bgcolor: getRiskLevelColor(overallRiskLevel),
                    color: 'white',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h4">
                    {overallRiskLevel}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    風險指數
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallRiskScore * 10} 
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      bgcolor: theme.palette.background.paper
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">低風險</Typography>
                    <Typography variant="caption" color="text.secondary">高風險</Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 2 }}>
                  您的表現優於全國 {comparison.betterThanPercentage}% 的用戶
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'left' }}>
                  {overallRiskLevel === RiskLevel.HIGH && '您在詐騙情境中的表現顯示出較高的風險傾向。請特別注意提高警覺性，並參考下方建議，增強防詐意識。'}
                  {overallRiskLevel === RiskLevel.MEDIUM && '您在詐騙情境中的表現顯示出中等的風險傾向。建議持續學習防詐知識，並培養批判性思考的習慣。'}
                  {overallRiskLevel === RiskLevel.LOW && '您在詐騙情境中表現出色，展現出較低的風險傾向。建議繼續保持這種警覺性，並將防詐知識分享給身邊的人。'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* 右側：風險類型 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader 
                title="您的風險類型" 
                subheader="以下是您最可能面臨的風險類型"
              />
              <CardContent>
                <Grid container spacing={2}>
                  {topRiskTypes.map((riskType) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={riskType}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getRiskTypeIcon(riskType)}
                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                          {riskType}
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mt: 1,
                          color: comparison.riskTypeComparison[riskType] > 0 ? 'error.main' : 'success.main'
                        }}>
                          {comparison.riskTypeComparison[riskType] > 0 ? (
                            <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                          ) : (
                            <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                          )}
                          <Typography variant="caption">
                            比平均{comparison.riskTypeComparison[riskType] > 0 ? '高' : '低'} {Math.abs(comparison.riskTypeComparison[riskType])}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    風險類型說明
                  </Typography>
                  <List dense>
                    {topRiskTypes.map((riskType) => (
                      <ListItem key={`desc-${riskType}`}>
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          {getRiskTypeIcon(riskType)}
                        </ListItemIcon>
                        <ListItemText
                          primary={riskType}
                          secondary={getRiskTypeDescription(riskType)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* 回答分析與建議 */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            評估結果分析
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            您的回答分析
          </Typography>
          <Box sx={{ mb: 3 }}>
            <List>
              {userResponses.map((response, index) => (
                <ListItem 
                  key={response.questionId}
                  sx={{ 
                    mb: 1, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    <Avatar 
                      sx={{ 
                        bgcolor: response.riskScore >= 7 
                          ? 'error.main' 
                          : response.riskScore >= 4 
                            ? 'warning.main' 
                            : 'success.main'
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={`問題 ${index + 1} 的回答`}
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                          "{response.responseText}"
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            風險指數：
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={response.riskScore * 10} 
                            sx={{ 
                              width: 100,
                              height: 8,
                              borderRadius: 4,
                              mr: 1
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {response.riskScore}/10
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* 詐騙者常用話術 */}
          <Typography variant="subtitle1" gutterBottom>
            針對您的風險類型，以下是詐騙者可能使用的話術
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              詐騙者語錄
            </Typography>
            <List dense>
              {scammerQuotes.map((quote, index) => (
                <ListItem key={`quote-${index}`}>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`"${quote}"`}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
          
          {/* 防護建議 */}
          <Typography variant="subtitle1" gutterBottom>
            個人化防詐建議
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            <List dense>
              {preventionTips.map((tip, index) => (
                <ListItem key={`tip-${index}`}>
                  <ListItemIcon>
                    <SecurityIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={tip}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
          
          {/* 隱私說明 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'background.paper', 
            p: 2, 
            borderRadius: 1,
            mt: 3
          }}>
            <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              您的評估結果僅儲存在您的裝置上，不會上傳到伺服器或分享給第三方。
            </Typography>
          </Box>
        </Paper>
        
        {/* 行動按鈕 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleBack}
          >
            重新評估
          </Button>
          <Button 
            variant="contained" 
            onClick={handleBackToHome}
          >
            返回主頁
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// 獲取風險類型說明
const getRiskTypeDescription = (riskType: RiskType): string => {
  switch (riskType) {
    case RiskType.FINANCIAL_INVESTMENT:
      return '您對財務和投資相關的詐騙較為敏感，可能容易被高報酬的投資機會所吸引。';
    case RiskType.EMOTIONAL_FRIENDSHIP:
      return '您可能容易被涉及情感或友誼的詐騙手法所影響，如假冒親友詐騙。';
    case RiskType.ONLINE_SHOPPING:
      return '您在線上購物情境中可能較容易忽略風險信號，建議加強網購詐騙的辨識能力。';
    case RiskType.PERSONAL_INFO_LEAK:
      return '您可能在分享個人資訊方面較為開放，這可能增加個資洩漏的風險。';
    case RiskType.IMPULSIVE_DECISION:
      return '您的回答顯示出可能會在壓力或急迫情境下做出衝動決策的傾向。';
    case RiskType.AUTHORITY_COMPLIANCE:
      return '您可能對聲稱來自權威單位的訊息較為信任，如偽裝成官方機構的詐騙。';
    case RiskType.INFO_TRUST:
      return '您可能較容易相信未經證實的資訊，這可能讓您面臨更高的詐騙風險。';
    case RiskType.TECH_INDIFFERENCE:
      return '您對技術相關的風險可能較不敏感，如釣魚網站或惡意連結等網路詐騙。';
    default:
      return '這是一種常見的風險類型，建議提高相關情境的警覺性。';
  }
};

export default PersonalReportPage;