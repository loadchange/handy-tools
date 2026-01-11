export function splitPrefix(prefix: string): string[] {
  const base = prefix.match(/[^0-9a-f]/i) === null
    ? prefix.match(/.{1,2}/g) ?? []
    : prefix.split(/[^0-9a-f]/i);

  return base.filter(Boolean).map(byte => byte.padStart(2, '0'));
}

export function generateRandomMacAddress({
  prefix = '',
  separator = ':',
  getRandomByte = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
}: {
  prefix?: string;
  separator?: string;
  getRandomByte?: () => string;
} = {}) {
  const prefixBytes = splitPrefix(prefix);
  const randomBytes = Array.from({ length: 6 - prefixBytes.length }, getRandomByte);
  const bytes = [...prefixBytes, ...randomBytes];

  return bytes.join(separator);
}

export function isValidPartialMacAddress(prefix: string): boolean {
  // Allow partial MAC addresses (1-5 bytes)
  const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){0,4}([0-9A-Fa-f]{1,2})?$/;
  return macAddressRegex.test(prefix);
}