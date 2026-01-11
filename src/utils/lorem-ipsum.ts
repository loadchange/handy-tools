const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

function getRandomWord(): string {
  return words[Math.floor(Math.random() * words.length)];
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateLoremIpsum(options: {
  paragraphCount: number;
  sentencePerParagraph: number;
  wordCount: number | [number, number];
  startWithLoremIpsum: boolean;
  asHTML: boolean;
}): string {
  const {
    paragraphCount,
    sentencePerParagraph,
    wordCount,
    startWithLoremIpsum,
    asHTML
  } = options;

  const paragraphs: string[] = [];

  for (let p = 0; p < paragraphCount; p++) {
    const sentences: string[] = [];

    for (let s = 0; s < sentencePerParagraph; s++) {
      const wordsInSentence: string[] = [];
      const actualWordCount = Array.isArray(wordCount)
        ? Math.floor(Math.random() * (wordCount[1] - wordCount[0] + 1)) + wordCount[0]
        : wordCount;

      for (let w = 0; w < actualWordCount; w++) {
        let word = getRandomWord();

        // First word of first sentence
        if (p === 0 && s === 0 && w === 0 && startWithLoremIpsum) {
          word = 'lorem';
          // Add ipsum as second word if lorem is first
          if (actualWordCount > 1) {
            wordsInSentence.push(word);
            word = 'ipsum';
            w++;
          }
        } else if (w === 0) {
          // Capitalize first word of each sentence
          word = capitalizeFirstLetter(word);
        }

        wordsInSentence.push(word);
      }

      sentences.push(wordsInSentence.join(' '));
    }

    paragraphs.push(sentences.join('. '));
  }

  let result = paragraphs.join(asHTML ? '</p><p>' : '\n\n');

  if (asHTML) {
    result = `<p>${result}</p>`;
  }

  // Add final punctuation if not HTML
  if (!asHTML) {
    result = result.replace(/\.$/, '');
  }

  return result;
}