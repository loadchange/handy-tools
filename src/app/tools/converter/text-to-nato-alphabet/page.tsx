'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Copy, Volume2 } from 'lucide-react';

const NATO_ALPHABET: { [key: string]: string } = {
  'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
  'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett',
  'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
  'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
  'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
  'Z': 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
  '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
  '-': 'Dash', '.': 'Stop'
};

export default function TextToNatoAlphabetPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    const chars = input.toUpperCase().split('');
    const result = chars.map(char => {
      if (/[A-Z0-9\-\.]/.test(char)) {
        return NATO_ALPHABET[char];
      }
      return char === ' ' ? '(space)' : char;
    });
    setOutput(result);
  }, [input]);

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(output.filter(w => w !== '(space)').join(', '));
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Text to NATO Alphabet</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert text to the NATO phonetic alphabet for clear communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type something..."
              className="min-h-[300px] text-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>NATO Output</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={speak} disabled={!input}>
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(output.join(' '))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] p-4 bg-muted rounded-md space-y-2 max-h-[500px] overflow-y-auto">
              {input.split('').map((char, i) => {
                const upperChar = char.toUpperCase();
                const nato = NATO_ALPHABET[upperChar];
                if (!char.trim()) return <div key={i} className="h-4"></div>;

                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded">
                      {char}
                    </span>
                    <span className="font-mono text-lg font-medium">
                      {nato || char}
                    </span>
                  </div>
                );
              })}
              {!input && <div className="text-muted-foreground text-center pt-8">Result will appear here</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
