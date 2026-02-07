const request = require('supertest');
const app = require('../index');
const User = require('../src/models/user.model');
const Waste = require('../src/models/waste.model');

describe('Waste Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Clear users and wastes before each test
    await User.deleteMany({});
    await Waste.deleteMany({});

    // Register and login a user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123!',
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
      });

    token = loginResponse.body.data;

    // Get user ID from login or register response
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    userId = meResponse.body.data.id;
  }, 10000);

  describe('POST /api/waste/create', () => {
    it('should create a waste record successfully', async () => {
      const wasteData = {
        wastename: 'apple',
      };

      const response = await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send(wasteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.wasteType).toBeDefined();
      expect(response.body.data.binColor).toBeDefined();
      expect(response.body.data.suggestion).toBeDefined();
      expect(response.body.message).toBe('Waste Record Created!');
    });

    it('should return 400 for missing wastename', async () => {
      const response = await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Required fields are missing');
    });

    it('should return 400 for empty wastename', async () => {
      const wasteData = {
        wastename: '   ',
      };

      const response = await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send(wasteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Wastename cannot be empty');
    });

    it('should return 401 without token', async () => {
      const wasteData = {
        wastename: 'apple',
      };

      const response = await request(app)
        .post('/api/waste/create')
        .send(wasteData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('GET /api/waste/history', () => {
    beforeEach(async () => {
      // Create some waste records for the user
      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'apple' });

      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'plastic bottle' });
    });

    it('should get waste history successfully', async () => {
      const response = await request(app)
        .get('/api/waste/history')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.history).toBeInstanceOf(Array);
      expect(response.body.data.history.length).toBeGreaterThan(0);
      expect(response.body.data.pagination).toHaveProperty('page');
      expect(response.body.data.pagination).toHaveProperty('limit');
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('pages');
      expect(response.body.message).toBe('Fetched Waste History');
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/waste/history?page=1&limit=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.history.length).toBe(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/waste/history')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });
});
