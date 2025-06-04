// Mock Supabase client for testing
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  data: [],
  error: null,
  then: function(callback) {
    return callback({
      data: this.data,
      error: this.error
    });
  }
};

module.exports = {
  supabase: mockSupabase
};
