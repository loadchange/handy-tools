export function generateNumeronym(word: string): string {
  if (!word) return '';

  const length = word.length;
  if (length <= 2) return word;

  const firstChar = word.charAt(0);
  const lastChar = word.charAt(length - 1);
  const middleCount = length - 2;

  return `${firstChar}${middleCount}${lastChar}`;
}