import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 導入主題和全局樣式
import GlobalStyles from './styles/GlobalStyles';

// 導入上下文提供者
import { AppProvider } from './contexts/AppContext';

// 導入頁面組件
import LandingPage from './pages/LandingPage';
import PermissionSetupPage from './pages/PermissionSetupPage';
import ChatSimulatorPage from './pages/ChatSimulatorPage';
import EducationPage from './pages/EducationPage';
import ScenarioPage from './pages/ScenarioPage';
import ScenarioCompletionPage from './pages/ScenarioCompletionPage';
import NotFoundPage from './pages/NotFoundPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles />
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatSimulatorPage />} />
            <Route path="/permission-setup" element={<PermissionSetupPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/scenario/:id" element={<ScenarioPage />} />
            <Route path="/scenario/:id/completion" element={<ScenarioCompletionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
