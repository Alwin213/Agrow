// tests/index.test.js
const request = require('supertest');
const { app, db, server } = require('../index');
jest.setTimeout(180000); 
 // Correctly import the app and db

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Set up a separate test database if needed (use async/await)
    await new Promise((resolve, reject) => {
      db.query('CREATE DATABASE IF NOT EXISTS agrowdb;', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Wait for the server to start
    await new Promise((resolve) => {
      server.on('listening', resolve);
    });
  });

  afterAll(async () => {
    // Clean up test database after all tests
    await new Promise((resolve, reject) => {
      db.query('DROP DATABASE IF EXISTS agrowdb;', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Close server after tests
    server.close();
  });

  test('GET /land should fetch all records', async () => {
    const response = await request(app).get('/land');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /land should handle database errors', async () => {
    // Simulate a database failure
    db.query = jest.fn().mockImplementationOnce((sql, cb) => cb(new Error('Database error')));

    const response = await request(app).get('/land');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Database query error');
  });
});
