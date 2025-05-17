import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button, 
  Chip,
  useMediaQuery,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useAppContext } from '../contexts/AppContext';
import { getAllScenarios, Scenario } from '../utils/scenarios';
import { newScenarios } from '../utils/newScenarios';
import ScenarioCard from '../components/ScenarioCard';

// 定義過濾標籤類型
type FilterTab = 'all' | 'completed' | 'uncompleted' | 'new';

const EducationPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { completedScenarios, setCurrentPage } = useAppContext();
  
  // 情境資料狀態
  const [allScenarios, setAllScenarios] = useState<Scenario[]>(getAllScenarios());
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>(allScenarios);
  
  // 搜尋和過濾狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState<FilterTab>('all');
  
  // 處理搜尋與過濾
  useEffect(() => {
    // 先取得所有情境
    const scenarios = getAllScenarios();
    
    // 依據搜尋詞過濾
    let filtered = scenarios;
    if (searchTerm) {
      filtered = scenarios.filter(scenario => 
        scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        scenario.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 依據標籤過濾
    switch (currentTab) {
      case 'completed':
        filtered = filtered.filter(scenario => completedScenarios.includes(scenario.id));
        break;
      case 'uncompleted':
        filtered = filtered.filter(scenario => !completedScenarios.includes(scenario.id));
        break;
      case 'new':
        const newScenariosIds = newScenarios.map(s => s.id);
        filtered = filtered.filter(scenario => newScenariosIds.includes(scenario.id));
        break;
      default:
        // 全部情境不需額外過濾
        break;
    }
    
    setFilteredScenarios(filtered);
  }, [searchTerm, currentTab, completedScenarios]);
  
  // 檢查情境是否為新增的
  const isNewScenario = (id: string) => {
    return newScenarios.some(s => s.id === id);
  };
  
  // 計算完成百分比
  const completionPercentage = Math.round((completedScenarios.length / allScenarios.length) * 100);
  
  // 處理標籤切換
  const handleTabChange = (event: React.SyntheticEvent, newValue: FilterTab) => {
    setCurrentTab(newValue);
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4,
      background: 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)'
    }}>
      <Container maxWidth="lg">
        {/* 頁頭部分 */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            互動式防詐教育
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
            透過實境模擬的詐騙情境，學習如何辨識與防範各種詐騙手法，提升您的防詐意識。
          </Typography>
          
          <Box sx={{ 
            display: 'inline-block', 
            px: 3, 
            py: 1, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            mt: 2
          }}>
            <Typography variant="body1">
              已完成：{completedScenarios.length}/{allScenarios.length} 情境 ({completionPercentage}%)
            </Typography>
          </Box>
        </Box>
        
        {/* 搜尋與過濾區域 */}
        <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="搜尋情境..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{ minHeight: 'auto' }}
              >
                <Tab 
                  label="全部" 
                  value="all" 
                  sx={{ minHeight: '40px' }}
                />
                <Tab 
                  label="已完成" 
                  value="completed" 
                  sx={{ minHeight: '40px' }}
                />
                <Tab 
                  label="未完成" 
                  value="uncompleted" 
                  sx={{ minHeight: '40px' }}
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span>新增</span>
                      <Chip 
                        label={newScenarios.length} 
                        color="secondary" 
                        size="small" 
                        sx={{ ml: 1, height: 20, minWidth: 20 }} 
                      />
                    </Box>
                  } 
                  value="new" 
                  sx={{ minHeight: '40px' }}
                />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>
        
        {/* 搜尋結果提示 */}
        {searchTerm && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              "{searchTerm}" 的搜尋結果: {filteredScenarios.length} 個情境
            </Typography>
          </Box>
        )}
        
        {/* 情境卡片列表 */}
        <Grid container spacing={3}>
          {filteredScenarios.length > 0 ? (
            filteredScenarios.map((scenario) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={scenario.id}>
                <ScenarioCard 
                  scenario={scenario} 
                  isNew={isNewScenario(scenario.id)}
                />
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  沒有找到符合條件的情境
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentTab('all');
                  }}
                >
                  清除搜尋條件
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
        
        {/* 返回按鈕 */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => {
              setCurrentPage('chat');
              navigate('/chat');
            }}
          >
            返回聊天模擬
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EducationPage; 