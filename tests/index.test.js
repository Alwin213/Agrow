const request = require('supertest');
const { app, db, server } = require('../index');
const mysql = require('mysql2');
jest.setTimeout(180000);

// Mock the MySQL `createConnection` method
jest.mock('mysql2', () => {
  const mockQuery = jest.fn();
  const mockDb = {
    query: mockQuery,
    connect: jest.fn(),
    end: jest.fn(),
  };
  return {
    createConnection: jest.fn(() => mockDb),
  };
});

describe('API Endpoints for /land', () => {
  beforeAll(async () => {
    // Set up a separate test database if needed
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

  describe('GET /land', () => {
    it('should fetch all records', async () => {
      mysql.createConnection().query.mockImplementation((sql, callback) => {
        callback(null, [
          { id: 1, Typeoffarmingland: 'Rice', Area: 100, Location: 'East Valley', ContactNo: '1234567890' }
        ]);
      });

      const response = await request(app).get('/land');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, Typeoffarmingland: 'Rice', Area: 100, Location: 'East Valley', ContactNo: '1234567890' }
      ]);
    });

    it('should handle database query errors', async () => {
      mysql.createConnection().query.mockImplementationOnce((sql, callback) => {
        callback(new Error('Database query error'), null);
      });

      const response = await request(app).get('/land');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database query failed');
    });
  });

  describe('POST /land', () => {
    it('should create a new record', async () => {
      const newRecord = {
        Typeoffarmingland: 'Wheat Farming',
        Area: 150,
        Location: 'North Valley',
        ContactNo: '9876543210',
      };

      mysql.createConnection().query.mockImplementation((sql, params, callback) => {
        callback(null, { insertId: 1 });
      });

      const response = await request(app).post('/land').send(newRecord);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
    });

    it('should handle database insert errors', async () => {
      mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database insert failed'), null);
      });

      const response = await request(app).post('/land').send({});
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database insert failed');
    });
  });

  describe('PUT /land/:id', () => {
    it('should update a record', async () => {
      const updatedRecord = {
        Typeoffarmingland: 'Corn Farming',
        Area: 200,
        Location: 'West Valley',
        ContactNo: '1112223333',
      };

      mysql.createConnection().query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app).put('/land/1').send(updatedRecord);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Record updated successfully');
    });

    it('should handle database update errors', async () => {
      mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database update failed'), null);
      });

      const response = await request(app).put('/land/1').send({});
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database update failed');
    });
  });

  describe('DELETE /land/:id', () => {
    it('should delete a record', async () => {
      mysql.createConnection().query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app).delete('/land/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Record deleted successfully');
    });

    it('should handle database delete errors', async () => {
      mysql.createConnection().query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database delete failed'), null);
      });

      const response = await request(app).delete('/land/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database delete failed');
    });
  });
});
