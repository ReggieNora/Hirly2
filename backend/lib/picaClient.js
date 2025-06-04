const axios = require('axios');

const picaApiKey = process.env.PICA_API_KEY;

if (!picaApiKey) {
  console.warn('Warning: PICA_API_KEY environment variable is not set. Pica API calls will fail.');
}

const pica = axios.create({
  baseURL: process.env.PICA_API_URL || 'https://api.pica.io/v1',
  headers: {
    'Authorization': `Bearer ${picaApiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Add request interceptor for logging
pica.interceptors.request.use(
  config => {
    console.log(`[Pica API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('[Pica API] Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
pica.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('[Pica API] Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[Pica API] No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[Pica API] Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Call a Pica AI agent
 * @param {string} agentName - Name of the agent (e.g., 'resume-analyzer')
 * @param {Object} input - Input data for the agent
 * @param {Object} options - Additional options
 * @param {number} options.timeout - Request timeout in milliseconds
 * @returns {Promise<Object>} - Agent response
 */
const callAgent = async (agentName, input, options = {}) => {
  try {
    const response = await pica.post(`/agents/${agentName}/run`, input, {
      timeout: options.timeout || 30000
    });
    return response.data;
  } catch (error) {
    console.error(`[Pica API] Error calling agent ${agentName}:`, error.message);
    throw new Error(`Failed to call ${agentName}: ${error.message}`);
  }
};

// Predefined agent functions
const agents = {
  /**
   * Analyze a resume
   * @param {string} resumeText - The resume text to analyze
   * @returns {Promise<Object>} - Analysis results
   */
  analyzeResume: async (resumeText) => {
    return callAgent('resume-analyzer', {
      text: resumeText,
      options: {
        extract: ['skills', 'experience', 'education', 'contact_info']
      }
    });
  },

  /**
   * Match resume to job description
   * @param {string} resumeText - The resume text
   * @param {string} jobDescription - The job description
   * @returns {Promise<Object>} - Match results
   */
  matchResumeToJob: async (resumeText, jobDescription) => {
    return callAgent('resume-matcher', {
      resume: resumeText,
      job_description: jobDescription
    });
  },

  /**
   * Generate interview questions based on resume
   * @param {string} resumeText - The resume text
   * @param {number} count - Number of questions to generate
   * @returns {Promise<Object>} - Generated questions
   */
  generateInterviewQuestions: async (resumeText, count = 5) => {
    return callAgent('interview-question-generator', {
      resume: resumeText,
      count: count
    });
  }
};

module.exports = {
  pica,
  callAgent,
  agents
};
