// Simplified BIP39 Implementation
const englishWordList = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alert', 'alien',
  'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always',
  'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle',
  'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety',
  'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'arch', 'arctic', 'area', 'arena',
  'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow',
  'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
  'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august',
  'aunt', 'author', 'auto', 'autumn', 'average', 'avatar', 'avoid', 'awake', 'aware', 'away',
  'awesome', 'awful', 'awkward', 'axis'
];

// Generate Random Entropy
export function generateEntropy(length: number = 32): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Convert Entropy to Mnemonic
export function entropyToMnemonic(entropy: string): string {
  if (!entropy) return '';

  // Simplified version - Uses entropy as a random seed to generate mnemonics
  const numWords = 12; // Standard is 12 words
  const words: string[] = [];

  // Use entropy as seed for pseudo-random number generation
  let seed = 0;
  for (let i = 0; i < entropy.length; i++) {
    seed = (seed * 31 + entropy.charCodeAt(i)) % englishWordList.length;
  }

  for (let i = 0; i < numWords; i++) {
    const randomIndex = (seed + i) % englishWordList.length;
    words.push(englishWordList[randomIndex]);
    seed = (seed * 31 + randomIndex) % englishWordList.length;
  }

  return words.join(' ');
}

// Validate Mnemonic Format
export function validateMnemonic(mnemonic: string): boolean {
  if (!mnemonic) return false;

  const words = mnemonic.trim().split(/\s+/);
  // Basic validation - Should be 12, 15, 18, 21, or 24 words
  return [12, 15, 18, 21, 24].includes(words.length);
}
