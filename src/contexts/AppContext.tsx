import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定義上下文類型
interface AppContextType {
  // 權限相關狀態
  authorizedPlatforms: string[];
  setAuthorizedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  isPremium: boolean;
  setIsPremium: React.Dispatch<React.SetStateAction<boolean>>;
  
  // 當前活動頁面
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  
  // 截圖相關
  screenshotData: string | null;
  setScreenshotData: React.Dispatch<React.SetStateAction<string | null>>;
  
  // 互動教育狀態
  completedScenarios: string[];
  addCompletedScenario: (scenarioId: string) => void;
}

// 創建上下文
const AppContext = createContext<AppContextType | undefined>(undefined);

// 提供上下文的組件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // 權限相關狀態
  const [authorizedPlatforms, setAuthorizedPlatforms] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // 當前活動頁面
  const [currentPage, setCurrentPage] = useState<string>('landing');
  
  // 截圖相關
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  
  // 互動教育狀態
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  
  const addCompletedScenario = (scenarioId: string) => {
    if (!completedScenarios.includes(scenarioId)) {
      setCompletedScenarios([...completedScenarios, scenarioId]);
    }
  };
  
  // 提供的上下文值
  const value = {
    authorizedPlatforms,
    setAuthorizedPlatforms,
    isPremium,
    setIsPremium,
    currentPage,
    setCurrentPage,
    screenshotData,
    setScreenshotData,
    completedScenarios,
    addCompletedScenario,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 自定義 Hook 便於使用上下文
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 