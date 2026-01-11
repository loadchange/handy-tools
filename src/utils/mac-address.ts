export function isValidMacAddress(mac: string): boolean {
  const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macAddressRegex.test(mac);
}

export function normalizeMacAddress(mac: string): string {
  return mac.toLowerCase().replace(/[:-]/g, ':');
}