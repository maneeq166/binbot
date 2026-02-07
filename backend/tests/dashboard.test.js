const request = require('supertest');
const app = require('../index');
const User = require('../src/models/user.model');
const Waste = require('../src/models/waste.model');

describe('Dashboard Routes', () => {
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

    // Get user ID
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    userId = meResponse.body.data.id;
  }, 10000);

  describe('GET /api/dashboard/summary', () => {
    it('should return dashboard summary with no data', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalItems).toBe(0);
      expect(response.body.data.biodegradableCount).toBe(0);
      expect(response.body.data.nonBiodegradableCount).toBe(0);
      expect(response.body.data.binUsage).toEqual({ green: 0, blue: 0, black: 0 });
      expect(response.body.message).toBe('No data found');
    });

    it('should return dashboard summary with data', async () => {
      // Create some waste records
      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'apple' }); // biodegradable, green

      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'plastic bottle' }); // non-biodegradable, blue

      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalItems).toBe(2);
      expect(response.body.data.biodegradableCount).toBe(1);
      expect(response.body.data.nonBiodegradableCount).toBe(1);
      expect(response.body.data.binUsage.green).toBe(1);
      expect(response.body.data.binUsage.blue).toBe(1);
      expect(response.body.data.binUsage.black).toBe(0);
      expect(response.body.message).toBe('success');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });
});
