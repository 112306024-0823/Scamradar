import { Global, css } from '@emotion/react';
import React from 'react';

const GlobalStyles: React.FC = () => {
  return (
    <Global
      styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
          overflow-x: hidden;
        }
        
        body {
          font-family: 'Noto Sans TC', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
          color: #222222;
          line-height: 1.5;
        }
        
        a {
          color: inherit;
          text-decoration: none;
        }
        
        /* Add animation and transition effects */
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        .scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f0f0f0;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c0c0c0;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a0a0a0;
        }
      `}
    />
  );
};

export default GlobalStyles; 