// Import the function to test directly
const { calculateSimilarity } = require('../routes/match');

// Test suite for the calculateSimilarity function
describe('Match Score Calculation', () => {
  describe('calculateSimilarity', () => {
    it('should return 1 for identical strings', () => {
      const text = 'This is a test string';
      const result = calculateSimilarity(text, text);
      if (result !== 1) {
        throw new Error(`Expected 1 but got ${result}`);
      }
    });

    it('should return 0 for completely different strings', () => {
      const text1 = 'apple banana';
      const text2 = 'orange peach';
      const result = calculateSimilarity(text1, text2);
      if (result !== 0) {
        throw new Error(`Expected 0 but got ${result}`);
      }
    });

    it('should return a score between 0 and 1 for similar strings', () => {
      const text1 = 'javascript developer';
      const text2 = 'senior javascript developer';
      const result = calculateSimilarity(text1, text2);
      if (result <= 0 || result >= 1) {
        throw new Error(`Expected value between 0 and 1 but got ${result}`);
      }
    });

    it('should be case insensitive', () => {
      const text1 = 'JavaScript';
      const text2 = 'javascript';
      const result = calculateSimilarity(text1, text2);
      if (result !== 1) {
        throw new Error(`Expected 1 but got ${result}`);
      }
    });

    it('should ignore punctuation', () => {
      const text1 = 'Hello, World!';
      const text2 = 'Hello World';
      const result = calculateSimilarity(text1, text2);
      if (result !== 1) {
        throw new Error(`Expected 1 but got ${result}`);
      }
    });

    it('should handle empty strings', () => {
      const testCases = [
        { a: '', b: 'test', expected: 0 },
        { a: 'test', b: '', expected: 0 },
        { a: '', b: '', expected: 0 }
      ];

      testCases.forEach(({ a, b, expected }) => {
        const result = calculateSimilarity(a, b);
        if (result !== expected) {
          throw new Error(`For ("${a}", "${b}") expected ${expected} but got ${result}`);
        }
      });
    });
  });
});
