const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const { requireAuth } = require('../middleware/auth');
const { agents } = require('../lib/picaClient');

const router = express.Router();

// Calculate text similarity between two strings
const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  // Simple cosine similarity implementation
  const tokenize = (text) => 
    text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/); // Split by whitespace
  
  const vec1 = tokenize(text1);
  const vec2 = tokenize(text2);
  
  // Create a set of all unique words
  const allWords = [...new Set([...vec1, ...vec2])];
  
  // Create frequency vectors
  const vec1Freq = allWords.map(word => 
    vec1.filter(w => w === word).length
  );
  
  const vec2Freq = allWords.map(word => 
    vec2.filter(w => w === word).length
  );
  
  // Calculate dot product
  const dotProduct = vec1Freq.reduce((sum, val, i) => 
    sum + (val * vec2Freq[i])
  , 0);
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(vec1Freq.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2Freq.reduce((sum, val) => sum + val * val, 0));
  
  // Calculate cosine similarity
  return mag1 && mag2 ? dotProduct / (mag1 * mag2) : 0;
};

// Export the function for testing
module.exports.calculateSimilarity = calculateSimilarity;

// Get matches for a user's resumes
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user's resumes
    const { data: resumes, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId);

    if (resumeError) throw resumeError;
    if (!resumes || resumes.length === 0) {
      return res.json({ message: 'No resumes found. Please upload a resume first.', matches: [] });
    }

    // 2. Get all active jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active');

    if (jobsError) throw jobsError;
    if (!jobs || jobs.length === 0) {
      return res.json({ message: 'No active jobs found.', matches: [] });
    }

    // 3. Calculate matches
    const matches = [];
    
    for (const resume of resumes) {
      for (const job of jobs) {
        // Calculate similarity between resume text and job description
        const similarity = calculateSimilarity(
          resume.text_content || '',
          `${job.title} ${job.description} ${job.requirements || ''} ${job.skills || ''}`
        );

        // Convert similarity to percentage (0-100)
        const matchPercentage = Math.round(similarity * 100);

        matches.push({
          resume_id: resume.id,
          resume_name: resume.file_name,
          job_id: job.id,
          job_title: job.title,
          company: job.company_name,
          match_percentage: matchPercentage,
          match_details: {
            skills: [],  // You can enhance this with skill-specific matching
            experience: 0,
            education: 0
          },
          last_updated: new Date().toISOString()
        });
      }
    }

    // Sort matches by percentage (highest first)
    matches.sort((a, b) => b.match_percentage - a.match_percentage);

    // 4. Save matches to database (optional)
    if (matches.length > 0) {
      const { error: insertError } = await supabase
        .from('resume_matches')
        .upsert(
          matches.map(match => ({
            user_id: userId,
            resume_id: match.resume_id,
            job_id: match.job_id,
            match_percentage: match.match_percentage,
            last_checked: new Date().toISOString()
          })),
          { onConflict: 'user_id,resume_id,job_id', ignoreDuplicates: false }
        );

      if (insertError) {
        console.error('Error saving matches:', insertError);
        // Don't fail the request, just log the error
      }
    }

    res.json({
      message: 'Matches calculated successfully',
      total_matches: matches.length,
      matches
    });

  } catch (error) {
    console.error('Error calculating matches:', error);
    res.status(500).json({ 
      error: 'Failed to calculate matches',
      details: error.message 
    });
  }
});

// Get match history for a user
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resume_matches')
      .select(`
        *,
        resume:resume_id (file_name),
        job:job_id (title, company_name)
      `)
      .eq('user_id', req.user.id)
      .order('last_checked', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching match history:', error);
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
});

// Export both the router and the utility function
module.exports = {
  router,
  calculateSimilarity
};
