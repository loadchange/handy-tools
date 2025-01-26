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
    // Use PowerShell to get printer list on Windows with UTF-8 encoding
    const { stdout } = await execPromise(
      'chcp 65001 >nul && powershell.exe -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-Printer | Select-Object Name,Type,PortName,DeviceType,Network,Shared | ConvertTo-Json"'
    );
    const printers = JSON.parse(stdout);

    // Convert to the format expected by the renderer
    const formattedPrinters = Array.isArray(printers) ? printers : [printers];
    const result = formattedPrinters.map((printer) => ({
      name: printer.Name,
      description: `${printer.Type} (${printer.PortName})`,
      isNetwork: printer.Network || printer.Name.startsWith("\\\\"),
      isDefault: false, // We'll set this later
    }));

    // Get default printer with UTF-8 encoding
    const { stdout: defaultPrinter } = await execPromise(
      'chcp 65001 >nul && powershell.exe -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; (Get-WmiObject -Query \\"Select * from Win32_Printer where Default = true\\").Name"'
    );
    const defaultPrinterName = defaultPrinter.trim();

    // Mark default printer
    result.forEach((printer) => {
      if (printer.name === defaultPrinterName) {
        printer.isDefault = true;
      }
    });

    console.log("Printers found:", result.length);
    return result;
  } catch (error) {
    console.error("Error getting printers:", error);
    return [];
  }
});

async function printWithPowerShell(content, printerName) {
  const tempFile = path.join(app.getPath("temp"), `print-content-${Date.now()}.txt`);
  try {
    // 写入内容到临时文件，使用 UTF-8 with BOM
    const fs = require("fs");
    fs.writeFileSync(tempFile, "\ufeff" + content, "utf8");

    // 验证打印机是否存在
    const validateCommand = `Get-Printer -Name "${printerName.replace(/"/g, '""')}" -ErrorAction SilentlyContinue`;
    const { stdout: printerExists } = await execPromise(`powershell.exe -Command "${validateCommand}"`);
    
    if (!printerExists) {
      throw new Error(`找不到打印机: ${printerName}`);
    }

    // 使用Windows原生打印命令
    const printCommand = `rundll32 msprint.dll,PrintUIEntry /k /n "${printerName.replace(/"/g, '""')}" "${tempFile.replace(/"/g, '""')}"`;
    await execPromise(printCommand);
    
    console.log("Print command executed successfully");
    return true;
  } catch (error) {
    console.error("Print error:", error);
    throw new Error(`打印失败: ${error.message}`);
  } finally {
    // 清理临时文件
    try {
      fs.unlinkSync(tempFile);
    } catch (e) {
      console.error("Error cleaning up temp file:", e);
    }
  }
}

ipcMain.handle("print-content", async (event, { content, printerName }) => {
  try {
    console.log("Print request received for printer:", printerName);

    // For network printers, first verify connection
    if (printerName.startsWith("\\\\")) {
      try {
        const computerName = printerName.split("\\")[2];
        console.debug("\n[DEBUG] Testing connection to network printer host:", computerName, "\n\n");
        const { stdout } = await execPromise(
          `chcp 65001 >nul && powershell.exe -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $result = Test-Connection -ComputerName '${computerName}' -Count 1 -Quiet; if ($result) { Write-Output 'True' } else { throw '无法连接到网络打印机，请检查打印机是否在线' }"`
        );
        console.debug("\n[DEBUG] Network printer connection result:", stdout.trim(), "\n\n");
        if (stdout.trim() !== "True") {
          throw new Error("无法连接到网络打印机，请检查打印机是否在线");
        }
      } catch (error) {
        console.error("Network printer connection error:", error);
        throw new Error("无法连接到网络打印机，请检查打印机是否在线");
      }
    }

    // Use PowerShell for printing
    const result = await printWithPowerShell(content, printerName);
    console.log("Print result:", result);
    return { success: result };
  } catch (error) {
    console.error("Error printing:", error);
    return { success: false, error: error.message };
  }
});
