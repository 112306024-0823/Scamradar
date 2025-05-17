import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';

import { useAppContext } from '../contexts/AppContext';
import { getScenarioById } from '../utils/scenarios';
import { generateRiskReport, generateScammerQuotes, generateScamTips, RiskType, RiskLevel } from '../utils/riskProfiles';
import RiskReportCard from '../components/RiskReportCard';

const ScenarioCompletionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { completedScenarios, setCurrentPage } = useAppContext();
  
  // 本地狀態
  const [showFullReport, setShowFullReport] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [scammerQuotes, setScammerQuotes] = useState<string[]>([]);
  const [preventionTips, setPreventionTips] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);
  
  const scenario = id ? getScenarioById(id) : null;
  
  useEffect(() => {
    if (scenario) {
      // 模擬用戶選擇，實際應用中應從狀態管理獲取
      const mockUserChoices = [
        { 
          scenarioId: scenario.id, 
          optionIds: ['opt-2', 'opt-5'] // 假設用戶選擇這些選項
        }
      ];
      
      // 生成風險報告
      const riskReport = generateRiskReport(mockUserChoices, [scenario]);
      
      // 設置分數 (基於表現)
      const performance = riskReport.scenarioResults[0]?.performance || 0;
      setScore(Math.round(performance));
      
      // 設置獎章
      if (performance >= 90) {
        setEarnedBadge('防詐達人');
      } else if (performance >= 70) {
        setEarnedBadge('警覺衛士');
      } else if (performance >= 50) {
        setEarnedBadge('初級偵探');
      }
      
      // 生成詐騙者語錄
      setScammerQuotes(generateScammerQuotes(riskReport.topRiskTypes));
      
      // 生成防詐小提示
      setPreventionTips(generateScamTips(riskReport.overallRiskLevel));
    }
  }, [scenario]);
  
  const handleBackToEducation = () => {
    setCurrentPage('education');
    navigate('/education');
  };
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const toggleFullReport = () => {
    setShowFullReport(!showFullReport);
  };
  
  if (!scenario) {
    return null;
  }
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        {/* 頁頭部分 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={handleBackToEducation}
            sx={{ mr: 2 }}
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {scenario.title} - 情境完成
          </Typography>
        </Box>
        
        {/* 完成橫幅 */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            color: 'white',
            textAlign: 'center',
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
              backgroundColor: 'rgba(255,255,255,0.1)',
              zIndex: 0
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 60, mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              情境完成！
            </Typography>
            <Typography variant="subtitle1">
              恭喜你完成了「{scenario.title}」模擬情境的體驗！
            </Typography>
          </Box>
        </Paper>
        
        {/* 分數與獎章 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                你的得分
              </Typography>
              <Box 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Typography variant="h3">
                  {score}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {score >= 80 ? '優秀！你展現了極高的防詐意識。' :
                 score >= 60 ? '不錯！你的防詐意識良好，但仍有提升空間。' :
                 '繼續加油！多了解詐騙手法可以提高你的防詐能力。'}
              </Typography>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                獲得成就
              </Typography>
              {earnedBadge ? (
                <>
                  <EmojiEventsIcon sx={{ fontSize: 60, color: 'warning.main', mb: 1 }} />
                  <Chip 
                    label={earnedBadge}
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    繼續完成更多情境可解鎖更多成就！
                  </Typography>
                </>
              ) : (
                <>
                  <Box sx={{ opacity: 0.5, mb: 2 }}>
                    <EmojiEventsIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    再接再厲！提高得分可以獲得成就徽章。
                  </Typography>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
        
        {/* 防詐要點 */}
        <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6">
              防詐要點
            </Typography>
            <IconButton 
              size="small" 
              color="inherit"
              onClick={() => toggleSection('tips')}
            >
              {expandedSection === 'tips' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSection === 'tips' || true}>
            <List sx={{ p: 0 }}>
              {scenario.tips.map((tip, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <DoneIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                  {index < scenario.tips.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        </Paper>
        
        {/* 詐騙者經典語錄 */}
        <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'error.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6">
              詐騙者經典語錄
            </Typography>
            <IconButton 
              size="small" 
              color="inherit"
              onClick={() => toggleSection('quotes')}
            >
              {expandedSection === 'quotes' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSection === 'quotes' || true}>
            <Box sx={{ p: 3 }}>
              {scammerQuotes.map((quote, index) => (
                <Card 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    borderLeft: `4px solid ${theme.palette.error.main}`,
                    bgcolor: 'error.light',
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {quote}
                    </Typography>
                    <Typography variant="caption" color="error.dark" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
                      — 詐騙者常用話術
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Collapse>
        </Paper>
        
        {/* 個人化防詐提示 */}
        <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'info.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6">
              個人化防詐提示
            </Typography>
            <IconButton 
              size="small" 
              color="inherit"
              onClick={() => toggleSection('preventionTips')}
            >
              {expandedSection === 'preventionTips' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSection === 'preventionTips' || true}>
            <List sx={{ p: 0 }}>
              {preventionTips.map((tip, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                  {index < preventionTips.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        </Paper>
        
        {/* 導覽按鈕 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToEducation}
          >
            返回學習中心
          </Button>
          
          <Button 
            variant="contained"
            onClick={toggleFullReport}
          >
            {showFullReport ? '隱藏詳細報告' : '查看詳細報告'}
          </Button>
        </Box>
        
        {/* 完整風險報告 */}
        {showFullReport && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              詳細風險報告
            </Typography>
            
            {/* 使用RiskReportCard組件顯示報告 */}
            <RiskReportCard 
              report={generateRiskReport(
                [{ scenarioId: scenario.id, optionIds: ['opt-2', 'opt-5'] }],
                [scenario]
              )} 
            />
          </Box>
        )}
        
        {/* 分享功能 */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={() => {
              // 分享功能實作
              alert('分享功能將在未來版本中推出！');
            }}
          >
            分享我的成績
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ScenarioCompletionPage; 