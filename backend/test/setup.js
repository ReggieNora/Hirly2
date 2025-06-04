// Mock Supabase client
jest.mock('../lib/supabaseClient', () => {
  const { supabase } = require('./mocks/supabase');
  return { supabase };
});

// Mock Pica client
jest.mock('../lib/picaClient', () => ({
  agents: {
    matchResumeToJob: jest.fn().mockResolvedValue({
      score: 0.85,
      explanation: 'Test match explanation'
    })
  }
}));

// Mock other dependencies as needed
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ id: 'test-user-id' }),
  sign: jest.fn().mockReturnValue('mock-jwt-token')
}));

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
