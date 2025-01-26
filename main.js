// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// Store mainWindow reference
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: false, // Don't show the window until it's ready
  });

  // Load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Only open DevTools in development environment
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Handle printer-related IPC events
ipcMain.handle("get-printers", async () => {
  try {
    const printers = await mainWindow.webContents.getPrintersAsync();
    if (Array.isArray(printers) && printers.length > 0) {
      return printers.map((printer) => ({
        ...printer,
        isNetwork: printer.Network || printer.name.startsWith("\\\\"),
      }));
    }
    return [];
  } catch (error) {
    console.log("64 getPrinters error:", error);
    return [];
  }
});

async function printContent(content, printerName) {
  return new Promise((resolve, reject) => {
    try {
      // 创建打印窗口
      const printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: process.env.NODE_ENV === "development",
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      // 生成打印内容的HTML
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>打印内容</title>
            <style>
              body {
                font-family: SimSun, "宋体", Arial, sans-serif;
                margin: 20px;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              @media print {
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `;

      // 创建临时文件
      const tempFile = path.join(app.getPath("temp"), `print-${Date.now()}.html`);
      require("fs").writeFileSync(tempFile, printContent, "utf8");
      const fileUrl = `file://${tempFile.replace(/\\/g, "/")}`;

      console.log("正在加载打印内容:", fileUrl);
      printWindow.loadURL(fileUrl);

      // 等待内容加载完成后打印
      printWindow.webContents.on("did-finish-load", async () => {
        try {
          console.log("load...");
          console.log("use =>", printerName);

          // 首先尝试获取打印机设置
          const printers = await printWindow.webContents.getPrintersAsync();
          console.log(151, { PrintersSize: printers.length });
          const printerInfo = printers.find((p) => p.name === printerName);
          console.log("153 print:", printerInfo);

          const options = {
            silent: true,
            printBackground: false,
            deviceName: printerName,
            // color: true,
            // margins: {
            //   marginType: "custom",
            //   top: 0.4,
            //   bottom: 0.4,
            //   left: 0.4,
            //   right: 0.4,
            // },
            // pageSize: "A4",
          };

          console.log("170 options:", options);

          try {
            // 尝试打印
            printWindow.webContents.print(options, function (success, errorType) {
              console.log(175, { success, errorType });

              if (success) {
                console.log("178 print success");
                resolve(true);
              } else {
                console.log("181 error...");
                resolve(false);
              }
            });
          } catch (printError) {
            console.error("186 printError:", printError);
            throw printError;
          }
        } catch (error) {
          console.error("191 error:", error);
          reject(error);
        } finally {
          // 清理资源
          try {
            // require("fs").unlinkSync(tempFile);
            // console.log("clear temp file");
          } catch (e) {
            // console.error("clear error:", e);
          }
          // printWindow.close();
        }
      });

      // 处理加载错误
      printWindow.webContents.on("did-fail-load", (error) => {
        console.error("206 did-fail-load:", error);
        printWindow.close();
        reject(new Error(`208 did-fail-load: ${error}`));
      });
    } catch (error) {
      console.error("211 init error:", error);
      reject(new Error(`212 error: ${error.message}`));
    }
  });
}

ipcMain.handle("print-content", async (event, { content, printerName }) => {
  try {
    console.log("PrinterName:", printerName);

    // 确保主窗口已经准备好
    if (!mainWindow || !mainWindow.webContents || !mainWindow.webContents.getPrintersAsync) {
      throw new Error("主窗口未准备好，请稍后重试");
    }

    // 获取所有打印机列表
    const printers = await mainWindow.webContents.getPrintersAsync();
    console.log({ printers });
    console.log("229 :", printers.map((p) => p.name).join(", "));

    // 检查打印机是否存在
    const printerExists = printers.some((p) => p.name === printerName);
    console.log({ printerExists, printerName });
    if (!printerExists) {
      throw new Error(`235: ${printerName}`);
    }

    // 执行打印
    console.log("239 start...");
    const result = await printContent(content, printerName);
    console.log("241 ", { result });
    return { success: true };
  } catch (error) {
    console.error("244 err:", error);
    return { success: false, error: error.message };
  }
});
