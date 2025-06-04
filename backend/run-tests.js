// Load environment variables first
require('dotenv').config();

// Import the calculateSimilarity function from the match module
const { calculateSimilarity } = require('./routes/match');

// Test cases
const testCases = [
  {
    name: 'identical strings',
    a: 'This is a test string',
    b: 'This is a test string',
    expected: 1
  },
  {
    name: 'completely different strings',
    a: 'apple banana',
    b: 'orange peach',
    expected: 0
  },
  {
    name: 'similar strings',
    a: 'javascript developer',
    b: 'senior javascript developer',
    expected: 'between 0 and 1'
  },
  {
    name: 'case insensitive',
    a: 'JavaScript',
    b: 'javascript',
    expected: 1
  },
  {
    name: 'ignores punctuation',
    a: 'Hello, World!',
    b: 'Hello World',
    expected: 1
  },
  {
    name: 'empty strings',
    a: '',
    b: '',
    expected: 0
  }
];

// Run tests
console.log('Running match score calculation tests...\n');
let passed = 0;

for (const test of testCases) {
  try {
    const result = calculateSimilarity(test.a, test.b);
    let success = false;
    let message = '';
    
    // Helper function to compare floating point numbers with a small epsilon
    const almostEqual = (a, b, epsilon = 1e-10) => Math.abs(a - b) < epsilon;
    
    if (test.expected === 'between 0 and 1') {
      success = result > 0 && result < 1;
      message = `Expected value between 0 and 1, got ${result}`;
    } else if (typeof test.expected === 'number') {
      success = almostEqual(result, test.expected);
      message = `Expected ~${test.expected}, got ${result}`;
    } else {
      success = result === test.expected;
      message = `Expected ${test.expected}, got ${result}`;
    }
    
    if (success) {
      console.log(`✅ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.name}`);
      console.log(`  ${message}`);
    }
  } catch (error) {
    console.log(`❌ ERROR in ${test.name}: ${error.message}`);
  }
}

console.log(`\n${passed} out of ${testCases.length} tests passed.`);

// Exit with appropriate status code
process.exit(passed === testCases.length ? 0 : 1);
