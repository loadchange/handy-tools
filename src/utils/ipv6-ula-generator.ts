import CryptoJS from 'crypto-js';

export interface Ipv6UlaResult {
  ula: string;
  firstRoutable: string;
  lastRoutable: string;
}

export function generateIpv6Ula(macAddress: string): Ipv6UlaResult {
  const timestamp = new Date().getTime();
  const hash = CryptoJS.SHA1(timestamp + macAddress).toString();
  const hex40bit = hash.substring(30);

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

  return {
    ula: `${ula}::/48`,
    firstRoutable: `${ula}:0::/64`,
    lastRoutable: `${ula}:ffff::/64`,
  };
}