const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Post a new job
router.post('/post', requireAuth, async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, requirements, skills, company_name, status = 'active' } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        title,
        description,
        requirements: requirements || null,
        skills: skills || null,
        company_name: company_name || null,
        status,
        employer_id: employerId
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job', details: error.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Update job (employer only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { data: existingJob, error: fetchError } = await supabase
      .from('jobs')
      .select('employer_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (existingJob.employer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const { data: job, error: updateError } = await supabase
      .from('jobs')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json({ success: true, job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job (employer only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { data: existingJob, error: fetchError } = await supabase
      .from('jobs')
      .select('employer_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (existingJob.employer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;