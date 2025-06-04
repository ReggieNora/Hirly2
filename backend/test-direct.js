// Direct test of the calculateSimilarity function
const { calculateSimilarity } = require('./routes/match');

// Test cases
const testCases = [
  {
    name: 'identical strings',
    a: 'hello world',
    b: 'hello world',
    expected: 1
  },
  {
    name: 'completely different strings',
    a: 'hello',
    b: 'goodbye',
    expected: 0
  },
  {
    name: 'similar strings',
    a: 'software engineer',
    b: 'senior software engineer',
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
    
    if (test.expected === 'between 0 and 1') {
      success = result > 0 && result < 1;
    } else {
      success = result === test.expected;
    }
    
    if (success) {
      console.log(`✅ PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.name}`);
      console.log(`  Expected: ${test.expected}, Got: ${result}`);
    }
  } catch (error) {
    console.log(`❌ ERROR in ${test.name}: ${error.message}`);
  }
}

console.log(`\n${passed} out of ${testCases.length} tests passed.`);
