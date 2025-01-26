const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    getPrinters: async () => {
      try {
        return await ipcRenderer.invoke('get-printers');
      } catch (error) {
        console.error('Error getting printers:', error);
        return [];
      }
    },
    printContent: async (content, printerName) => {
      try {
        return await ipcRenderer.invoke('print-content', { content, printerName });
      } catch (error) {
        console.error('Error printing:', error);
        return { success: false, error: error.message };
      }
    }
  }
)
