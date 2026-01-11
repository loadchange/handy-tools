export function obfuscateString(
  str: string,
  options: {
    keepFirst: number;
    keepLast: number;
    keepSpace: boolean;
  }
): string {
  if (!str) return '';

  const { keepFirst, keepLast, keepSpace } = options;
  const length = str.length;

  if (length <= keepFirst + keepLast) {
    return str;
  }

  let result = '';

  // Keep first characters
  if (keepFirst > 0) {
    result += str.substring(0, keepFirst);
  }

  // Obfuscate middle characters
  const middleStart = keepFirst;
  const middleEnd = length - keepLast;
  const middleText = str.substring(middleStart, middleEnd);

  for (let i = 0; i < middleText.length; i++) {
    const char = middleText[i];
    if (keepSpace && char === ' ') {
      result += char;
    } else if (char.match(/[a-zA-Z0-9]/)) {
      // Replace alphanumeric characters with asterisks
      result += '*';
    } else {
      // Keep other special characters as-is
      result += char;
    }
  }

  // Keep last characters
  if (keepLast > 0) {
    result += str.substring(length - keepLast);
  }

  return result;
}