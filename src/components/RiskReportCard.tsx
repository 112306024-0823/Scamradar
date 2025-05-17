import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  LinearProgress,
  Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { RiskReport, RiskType, RiskLevel } from '../utils/riskProfiles';

interface RiskReportCardProps {
  report: RiskReport;
}

const RiskReportCard: React.FC<RiskReportCardProps> = ({ report }) => {
  const theme = useTheme();
  
  // 根據風險等級獲取顏色
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
  
  // 獲取風險類型的圖標
  const getRiskTypeIcon = (riskType: RiskType) => {
    switch (riskType) {
      case RiskType.FINANCIAL_INVESTMENT:
        return '💰';
      case RiskType.EMOTIONAL_FRIENDSHIP:
        return '💔';
      case RiskType.ONLINE_SHOPPING:
        return '🛒';
      case RiskType.PERSONAL_INFO_LEAK:
        return '🔐';
      case RiskType.IMPULSIVE_DECISION:
        return '⚡';
      case RiskType.AUTHORITY_COMPLIANCE:
        return '👮';
      case RiskType.INFO_TRUST:
        return '📰';
      case RiskType.TECH_INDIFFERENCE:
        return '📱';
      default:
        return '❓';
    }
  };
  
  return (
    <Paper 
      elevation={3}
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        mb: 4
      }}
    >
      {/* 報告標題 */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          p: 3,
          position: 'relative'
        }}
      >
        <Typography variant="h4" gutterBottom>
          你的防詐風險報告
        </Typography>
        <Typography variant="subtitle1">
          根據你在模擬情境中的表現，我們為你生成了個人化的風險評估報告，幫助你了解自己的防詐能力與風險點。
        </Typography>
      </Box>
      
      {/* 整體風險評級 */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* 左側：風險等級 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                bgcolor: getRiskLevelColor(report.overallRiskLevel) + '15',
                border: `1px solid ${getRiskLevelColor(report.overallRiskLevel)}`
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  整體風險等級
                </Typography>
                <Box 
                  sx={{ 
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: getRiskLevelColor(report.overallRiskLevel),
                    color: 'white',
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h4">
                    {report.overallRiskLevel}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {report.overallRiskLevel === RiskLevel.HIGH && '你在詐騙情境中的表現顯示出較高的風險傾向。請查看下方建議，提升防詐意識。'}
                  {report.overallRiskLevel === RiskLevel.MEDIUM && '你在詐騙情境中的表現顯示出中等的風險傾向。持續學習防詐知識，提升警覺性。'}
                  {report.overallRiskLevel === RiskLevel.LOW && '做得好！你在詐騙情境中展現出較低的風險傾向。繼續保持這種警覺性。'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* 右側：風險類型 */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader title="你的風險類型" />
              <CardContent>
                <Grid container spacing={2}>
                  {report.topRiskTypes.map((riskType) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={riskType}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography 
                          variant="h3" 
                          sx={{ mb: 1 }}
                        >
                          {getRiskTypeIcon(riskType)}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          {riskType}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Divider />
      
      {/* 行為模式分析 */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          行為模式分析
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          以下是基於你在模擬情境中的行為表現分析：
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                反應時間
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={report.behaviorAnalysis.reactionTime * 10}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                錯誤率
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={report.behaviorAnalysis.errorRate * 10}
                color="error"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                衝動程度
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={report.behaviorAnalysis.impulsiveness * 10}
                color="warning"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                服從性
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={report.behaviorAnalysis.compliance * 10}
                color="info"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                資訊揭露傾向
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={report.behaviorAnalysis.infoDisclosure * 10}
                color="secondary"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                壓力耐受度
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={report.behaviorAnalysis.stressTolerance * 10}
                color="success"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Divider />
      
      {/* 情境表現 */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          情境表現回顧
        </Typography>
        
        <Grid container spacing={2}>
          {report.scenarioResults.map((result) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={result.scenarioId}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader 
                  title={result.scenarioTitle}
                  subheader={`正確率: ${Math.round(result.performance)}%`}
                  titleTypographyProps={{ variant: 'subtitle1' }}
                />
                
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      正確選擇:
                    </Typography>
                    <Chip 
                      label={`${result.correctChoices}/${result.totalChoices}`}
                      color={result.performance >= 70 ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={result.performance}
                    color={result.performance >= 70 ? 'success' : 
                           result.performance >= 40 ? 'warning' : 'error'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Divider />
      
      {/* 防詐建議 */}
      <Box 
        sx={{ 
          p: 3,
          bgcolor: 'primary.dark',
          color: 'white'
        }}
      >
        <Typography variant="h5" gutterBottom>
          個人化防詐建議
        </Typography>
        
        <List>
          {report.recommendations.map((recommendation, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemText primary={recommendation} />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Divider />
      
      {/* 學習資源 */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          推薦學習資源
        </Typography>
        
        <Grid container spacing={2}>
          {report.learningResources.map((resource, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                variant="outlined"
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  <Link 
                    href={resource.link}
                    underline="hover"
                    sx={{ fontWeight: 'medium' }}
                  >
                    查看資源
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default RiskReportCard; 