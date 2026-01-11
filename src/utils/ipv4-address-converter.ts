export function ipv4ToInt(ip: string): number {
  const parts = ip.split('.');
  if (parts.length !== 4) {
    throw new Error('Invalid IPv4 address');
  }

  return parts.reduce((acc, part) => {
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      throw new Error('Invalid IPv4 address');
    }
    return (acc << 8) + num;
  }, 0);
}

export function intToIpv4(int: number): string {
  return `${(int >>> 24) & 255}.${(int >> 16) & 255}.${(int >> 8) & 255}.${int & 255}`;
}

export function isValidIpv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;

  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

export function convertBase(value: string, fromBase: number, toBase: number): string {
  const decimal = parseInt(value, fromBase);
  if (isNaN(decimal)) return '';
  return decimal.toString(toBase);
}