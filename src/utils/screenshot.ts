import html2canvas from 'html2canvas';

/**
 * 對指定元素進行截圖
 * @param element 要截圖的 DOM 元素
 * @returns Promise<string> 返回截圖的 base64 數據
 */
export const captureScreenshot = async (element: HTMLElement): Promise<string> => {
  try {
    // 設定截圖選項，確保高品質和正確的縮放比例
    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio, // 使用設備像素比例，確保清晰度
      useCORS: true, // 允許跨域圖片
      logging: false, // 關閉日誌
      allowTaint: true, // 允許截取跨域元素
      backgroundColor: '#121212', // 設定背景色，與應用主題一致
    });
    
    // 轉換為 base64 圖像數據
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('截圖失敗:', error);
    throw new Error('截圖過程中發生錯誤，請稍後再試。');
  }
};

/**
 * 將 Base64 圖片數據保存為檔案
 * @param base64Data 圖片的 base64 數據
 * @param filename 保存的檔案名稱
 */
export const saveScreenshot = (base64Data: string, filename: string = 'scamradar-screenshot.png'): void => {
  try {
    // 創建下載連結
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    
    // 模擬點擊下載
    document.body.appendChild(link);
    link.click();
    
    // 移除連結元素
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('保存截圖失敗:', error);
    throw new Error('保存截圖時發生錯誤，請稍後再試。');
  }
};

/**
 * 複製截圖到剪貼簿
 * @param base64Data 圖片的 base64 數據
 * @returns Promise<boolean> 是否成功複製
 */
export const copyScreenshotToClipboard = async (base64Data: string): Promise<boolean> => {
  try {
    // 從 base64 創建 Blob
    const res = await fetch(base64Data);
    const blob = await res.blob();
    
    // 使用 Clipboard API 複製
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    
    return true;
  } catch (error) {
    console.error('複製截圖到剪貼簿失敗:', error);
    
    // 如果 navigator.clipboard 不支援，嘗試替代方案
    try {
      // 創建臨時 canvas 元素
      const img = new Image();
      img.src = base64Data;
      
      // 當圖片加載完成，繪製到 canvas 上
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            
            // 顯示提示讓用戶手動複製
            canvas.toBlob((blob) => {
              if (blob) {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item])
                  .then(() => resolve(true))
                  .catch(() => {
                    alert('請使用鍵盤快捷鍵(Ctrl+C 或 Cmd+C)手動複製圖片。');
                    resolve(false);
                  });
              } else {
                resolve(false);
              }
            });
          } else {
            resolve(false);
          }
        };
      });
    } catch (fallbackError) {
      console.error('替代方案也失敗:', fallbackError);
      return false;
    }
  }
}; 