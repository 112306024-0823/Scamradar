import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Chip,
  Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

import { Scenario } from '../utils/scenarios';
import { useAppContext } from '../contexts/AppContext';

interface ScenarioCardProps {
  scenario: Scenario;
  isNew?: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, isNew = false }) => {
  const navigate = useNavigate();
  const { completedScenarios, setCurrentPage } = useAppContext();
  
  const isCompleted = completedScenarios.includes(scenario.id);
  
  const handleStartScenario = () => {
    setCurrentPage('scenario');
    navigate(`/scenario/${scenario.id}`);
  };
  
  // 取得難度相對應的顏色
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'primary';
    }
  };
  
  // 取得難度對應的中文文字
  const getDifficultyText = (difficulty: string) => {
    switch(difficulty) {
      case 'easy':
        return '簡單';
      case 'medium':
        return '中等';
      case 'hard':
        return '困難';
      default:
        return '未知';
    }
  };
  
  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
        },
        overflow: 'visible'
      }}
    >
      {/* 完成標記 */}
      {isCompleted && (
        <Chip
          label="已完成"
          color="success"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1
          }}
        />
      )}
      
      {/* 新情境標記 */}
      {isNew && (
        <Badge
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            zIndex: 1
          }}
          badgeContent={
            <Chip
              icon={<NewReleasesIcon />}
              label="新增"
              color="secondary"
              size="small"
            />
          }
        >
          <Box sx={{ width: 20, height: 20 }} />
        </Badge>
      )}
      
      {/* 卡片頭部 */}
      <Box sx={{ p: 2, bgcolor: 'primary.dark' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {scenario.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<WarningIcon />}
            label={scenario.type}
            size="small"
            variant="outlined"
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={getDifficultyText(scenario.difficulty)}
            size="small"
            variant="outlined"
            color={getDifficultyColor(scenario.difficulty)}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          />
        </Box>
      </Box>
      
      {/* 卡片內容 */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" paragraph>
          {scenario.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          學習如何識別和防範此類型詐騙
        </Typography>
      </CardContent>
      
      {/* 卡片動作 */}
      <CardActions>
        <Button
          fullWidth
          variant={isCompleted ? "outlined" : "contained"}
          onClick={handleStartScenario}
        >
          {isCompleted ? '再次體驗' : '開始體驗'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ScenarioCard; 