import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import SchoolIcon from '@mui/icons-material/School';

import { useAppContext } from '../contexts/AppContext';

// 特色功能卡片元件
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
      }
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 2, 
        background: 'linear-gradient(45deg, #8C52FF 30%, #4E9EFF 90%)'
      }}>
        {icon}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" align="center">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPage } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 頁面轉換函數
  const handleStartDemo = () => {
    setCurrentPage('permissions');
    navigate('/permission-setup');
  };

  // 特色功能資料
  const features = [
    {
      title: "即時訊息偵測",
      description: "AI 技術自動分析訊息內容，即時偵測可疑詐騙訊息，提供風險評估和警示。",
      icon: <SecurityIcon sx={{ fontSize: 60, color: 'white' }} />
    },
    {
      title: "主動截圖求證",
      description: "遇到可疑訊息？一鍵截圖分享給專業人士，快速獲得協助和建議。",
      icon: <WarningIcon sx={{ fontSize: 60, color: 'white' }} />
    },
    {
      title: "互動情境教學",
      description: "透過真實案例模擬，學習識別各種詐騙手法，提升防詐意識和技巧。",
      icon: <SchoolIcon sx={{ fontSize: 60, color: 'white' }} />
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)',
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 12 }
      }}
    >
      {/* 頁頭部分 */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 4, md: 8 }
          }}
        >
          <Box sx={{ mb: isMobile ? 4 : 0 }}>
            <Typography
              component="h1"
              variant="h2"
              color="primary.main"
              fontWeight="bold"
              gutterBottom
              className="fade-in"
            >
              ScamRadar
            </Typography>
            <Typography
              variant="h4"
              color="text.primary"
              paragraph
              className="fade-in"
              sx={{ animation: 'fadeIn 0.5s ease-in 0.2s both' }}
            >
              AI 智慧防詐
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              paragraph
              className="fade-in"
              sx={{ animation: 'fadeIn 0.5s ease-in 0.4s both' }}
            >
              運用先進的 AI 技術，即時偵測網路上的詐騙訊息，保護您的數位安全。
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartDemo}
              className="scale-in"
              sx={{ 
                mt: 2,
                fontSize: '1.2rem',
                py: 1.5,
                px: 4,
                animation: 'scaleIn 0.3s ease-out 0.6s both'
              }}
            >
              立即體驗 Demo
            </Button>
          </Box>
          
          {/* 右側圖像 */}
          <Box 
            component="img"
            src="/shield-logo.png"
            alt="ScamRadar"
            sx={{
              width: isMobile ? '80%' : '40%',
              maxWidth: 400,
              height: 'auto',
              animation: 'scaleIn 0.5s ease-out 0.4s both'
            }}
          />
        </Box>

        {/* 特色功能部分 */}
        <Typography
          variant="h4"
          component="h2"
          color="text.primary"
          align="center"
          gutterBottom
          sx={{ mt: 8, mb: 4 }}
        >
          主要功能
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard 
                title={feature.title} 
                description={feature.description} 
                icon={feature.icon} 
              />
            </Grid>
          ))}
        </Grid>
        
        {/* 底部 CTA */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: { xs: 6, md: 10 }, 
          p: 4, 
          borderRadius: 4,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h5" color="text.primary" gutterBottom>
            準備好了嗎？
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            立即體驗 ScamRadar 的智慧防詐功能，提升您的網路安全意識。
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartDemo}
            sx={{ mt: 2 }}
          >
            開始體驗
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 