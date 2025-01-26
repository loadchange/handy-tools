// DOM Elements
const printerSelect = document.getElementById('printerSelect');
const printerStatus = document.getElementById('printerStatus');
const printContent = document.getElementById('printContent');
const printButton = document.getElementById('printButton');

// Input handling
let isProcessing = false;

// Prevent input during processing
function setInputState(disabled) {
  printContent.disabled = disabled;
  printerSelect.disabled = disabled;
  if (disabled) {
    printContent.style.opacity = '0.7';
    printerSelect.style.opacity = '0.7';
  } else {
    printContent.style.opacity = '1';
    printerSelect.style.opacity = '1';
  }
}

// Handle textarea focus
printContent.addEventListener('focus', () => {
  if (!isProcessing) {
    printContent.style.borderColor = '#2980b9';
  }
});

printContent.addEventListener('blur', () => {
  printContent.style.borderColor = '#ddd';
});

// Add input event listener with debounce
let inputTimeout;
printContent.addEventListener('input', () => {
  if (inputTimeout) {
    clearTimeout(inputTimeout);
  }
  inputTimeout = setTimeout(() => {
    // Validate input if needed
    const content = printContent.value.trim();
    printButton.disabled = !content || !printerSelect.value;
  }, 100);
});

// Load printer list on startup
async function loadPrinters() {
  try {
    console.log('Fetching printers...');
    const printers = await window.electronAPI.getPrinters();
    console.log('Printers received:', printers);

    // Clear existing options except the first one
    while (printerSelect.options.length > 1) {
      printerSelect.remove(1);
    }

    // Add printer options
    printers.forEach(printer => {
      const option = document.createElement('option');
      option.value = printer.name;
      option.textContent = `${printer.name} ${printer.isDefault ? '(默认)' : ''} ${printer.isNetwork ? '(网络打印机)' : ''}`;
      printerSelect.appendChild(option);
    });
    
    if (printers.length === 0) {
      printerStatus.textContent = '未检测到打印机';
      printerStatus.className = 'printer-status error';
      printButton.disabled = true;
    } else {
      const networkPrinters = printers.filter(p => p.isNetwork).length;
      const localPrinters = printers.length - networkPrinters;
      printerStatus.textContent = `发现 ${printers.length} 台打印机 (本地: ${localPrinters}, 网络: ${networkPrinters})`;
      printerStatus.className = 'printer-status success';
      printButton.disabled = false;
    }
  } catch (error) {
    console.error('Failed to load printers:', error);
    printerStatus.textContent = '获取打印机列表失败';
    printerStatus.className = 'printer-status error';
    printButton.disabled = true;
  }
}

// Handle printer selection change
printerSelect.addEventListener('change', () => {
  const selectedPrinter = printerSelect.value;
  const isNetworkPrinter = selectedPrinter.startsWith('\\\\');
  
  if (isNetworkPrinter) {
    printerStatus.textContent = '已选择网络打印机，请确保打印机在线';
    printerStatus.className = 'printer-status warning';
  } else if (selectedPrinter) {
    printerStatus.textContent = '打印机就绪';
    printerStatus.className = 'printer-status success';
  }
});

// Handle print button click
printButton.addEventListener('click', async () => {
  const selectedPrinter = printerSelect.value;
  const content = printContent.value.trim();

  if (!selectedPrinter) {
    alert('请选择打印机');
    return;
  }

  if (!content) {
    alert('请输入要打印的内容');
    return;
  }

  try {
    isProcessing = true;
    setInputState(true);
    printButton.disabled = true;
    printButton.textContent = '正在检查打印机...';
    printerStatus.textContent = '正在检查打印机状态...';
    printerStatus.className = 'printer-status warning';

    const result = await window.electronAPI.printContent(content, selectedPrinter);

    if (result.success) {
      alert('打印作业已发送到打印机！');
      printContent.value = '';
      printerStatus.textContent = '打印作业已发送';
      printerStatus.className = 'printer-status success';
    } else {
      const errorMsg = result.error || '未知错误';
      alert(`打印失败: ${errorMsg}\n请检查:\n1. 打印机是否开机\n2. 打印机是否联网\n3. 打印机是否有纸张`);
      printerStatus.textContent = `打印失败: ${errorMsg}`;
      printerStatus.className = 'printer-status error';
    }
  } catch (error) {
    const errorMsg = error.message || '未知错误';
    alert(`打印错误: ${errorMsg}\n请检查打印机状态后重试`);
    printerStatus.textContent = `打印错误: ${errorMsg}`;
    printerStatus.className = 'printer-status error';
  } finally {
    isProcessing = false;
    setInputState(false);
    printButton.disabled = false;
    printButton.textContent = '打印';
  }
});

// Load printers when page loads
document.addEventListener('DOMContentLoaded', loadPrinters);

// Refresh printer list every 30 seconds
setInterval(loadPrinters, 30000);
