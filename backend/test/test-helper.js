// Load environment variables first
require('dotenv').config({ path: '.env.test' });

// Test configuration and global test setup
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

// Enable chai http plugin
chai.use(chaiHttp);

// Global test variables
global.expect = chai.expect;
global.should = chai.should();
global.sinon = sinon;

// Create a sinon sandbox for each test
beforeEach(function() {
  this.sandbox = sinon.createSandbox();
});

// Clean up after tests
afterEach(function() {
  this.sandbox.restore();
});

// Make sure we're in test environment
process.env.NODE_ENV = 'test';
