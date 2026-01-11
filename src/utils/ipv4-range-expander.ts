import { convertBase, ipv4ToInt, intToIpv4 } from './ipv4-address-converter';

export interface Ipv4RangeExpanderResult {
  oldSize?: number;
  newStart?: string;
  newEnd?: string;
  newCidr?: string;
  newSize?: number;
}

function bits2ip(ipInt: number): string {
  return intToIpv4(ipInt);
}

function getRangesize(start: string, end: string): number {
  if (start == null || end == null) {
    return -1;
  }

  return 1 + Number.parseInt(end, 2) - Number.parseInt(start, 2);
}

function getCidr(start: string, end: string): { start: string; end: string; mask: number } | null {
  if (start == null || end == null) {
    return null;
  }

  const range = getRangesize(start, end);
  if (range < 1) {
    return null;
  }

  let mask = 32;
  for (let i = 0; i < 32; i++) {
    if (start[i] !== end[i]) {
      mask = i;
      break;
    }
  }

  const newStart = start.substring(0, mask) + '0'.repeat(32 - mask);
  const newEnd = end.substring(0, mask) + '1'.repeat(32 - mask);

  return { start: newStart, end: newEnd, mask };
}

export function calculateCidr({ startIp, endIp }: { startIp: string; endIp: string }): Ipv4RangeExpanderResult | undefined {
  try {
    const start = convertBase(ipv4ToInt(startIp).toString(), 10, 2).padStart(32, '0');
    const end = convertBase(ipv4ToInt(endIp).toString(), 10, 2).padStart(32, '0');

    const cidr = getCidr(start, end);
    if (cidr != null) {
      const result: Ipv4RangeExpanderResult = {};
      result.newEnd = bits2ip(Number.parseInt(cidr.end, 2));
      result.newStart = bits2ip(Number.parseInt(cidr.start, 2));
      result.newCidr = `${result.newStart}/${cidr.mask}`;
      result.newSize = getRangesize(cidr.start, cidr.end);

      result.oldSize = getRangesize(start, end);
      return result;
    }

    return undefined;
  } catch {
    return undefined;
  }
}