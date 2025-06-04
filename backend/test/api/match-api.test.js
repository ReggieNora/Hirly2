const request = require('supertest');
const { createTestApp } = require('../test-app');
const { supabase } = require('../../lib/supabaseClient');

let app;

beforeEach(() => {
  // Create a fresh app instance for each test
  app = createTestApp();
  
  // Reset all mocks
  jest.clearAllMocks();
});

describe('Match API Endpoints', () => {
  describe('GET /api/matches', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/matches')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('error', 'No token provided');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/matches')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('error', 'Invalid token');
    });

    it('should return matches for a valid user', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        data: [
          {
            id: 1,
            user_id: 'test-user-id',
            resume_id: 'resume-1',
            job_id: 'job-1',
            match_percentage: 85,
            last_checked: new Date().toISOString()
          }
        ],
        error: null
      });

      const res = await request(app)
        .get('/api/matches')
        .set('Authorization', 'Bearer valid-token')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('matches');
      expect(Array.isArray(res.body.matches)).toBe(true);
    });
  });

  describe('GET /api/matches/history', () => {
    it('should return match history for a user', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        data: [
          {
            id: 1,
            user_id: 'test-user-id',
            resume_id: 'resume-1',
            job_id: 'job-1',
            match_percentage: 85,
            last_checked: new Date().toISOString(),
            resume: { file_name: 'resume.pdf' },
            job: { title: 'Software Engineer', company_name: 'Tech Corp' }
          }
        ],
        error: null
      });

      const res = await request(app)
        .get('/api/matches/history')
        .set('Authorization', 'Bearer valid-token')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('resume.file_name');
      expect(res.body[0]).toHaveProperty('job.title');
    });
  });
});
