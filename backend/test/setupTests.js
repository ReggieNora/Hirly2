// Setup file for Jest tests
process.env.NODE_ENV = 'test';

// Mock the Supabase client
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    data: [],
    error: null,
    then: function(callback) {
      return callback({
        data: this.data,
        error: this.error
      });
    }
  }
}));

// Mock JWT verification
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    if (token === 'valid-token') {
      return callback(null, { id: 'test-user-id' });
    }
    return callback(new Error('Invalid token'));
  })
}));

// Mock other dependencies as needed
console.error = jest.fn(); // Suppress error logs during tests
