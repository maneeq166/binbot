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

  describe('GET /api/dashboard/analytics', () => {
    it('should return analytics with no data', async () => {
      const response = await request(app)
        .get('/api/dashboard/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bioVsNonBioPercentage).toEqual({ biodegradable: 0, "non-biodegradable": 0 });
      expect(response.body.data.binUsagePercentage).toEqual({ green: 0, blue: 0, black: 0 });
      expect(response.body.data.totalClassificationsOverTime).toEqual([]);
      expect(response.body.message).toBe('No data found');
    });

    it('should return analytics with data', async () => {
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
        .get('/api/dashboard/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bioVsNonBioPercentage.biodegradable).toBe(50);
      expect(response.body.data.bioVsNonBioPercentage["non-biodegradable"]).toBe(50);
      expect(response.body.data.binUsagePercentage.green).toBe(50);
      expect(response.body.data.binUsagePercentage.blue).toBe(50);
      expect(response.body.data.binUsagePercentage.black).toBe(0);
      expect(response.body.data.totalClassificationsOverTime).toHaveLength(1);
      expect(response.body.data.totalClassificationsOverTime[0].count).toBe(2);
      expect(response.body.message).toBe('success');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/dashboard/analytics')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should handle large dataset correctly', async () => {
      // Create waste records using defined rules
      const wasteItems = [
        'apple', 'apple', 'apple', 'apple', // 4 biodegradable, green
        'banana peel', 'banana peel', 'banana peel', 'banana peel', // 4 biodegradable, green
        'plastic bottle', 'plastic bottle', // 2 non-biodegradable, blue
        'battery', 'battery', // 2 non-biodegradable, black
        'apple', // 1 biodegradable, green
        'plastic bottle', // 1 non-biodegradable, blue
        'battery' // 1 non-biodegradable, black
      ];

      for (const wastename of wasteItems) {
        await request(app)
          .post('/api/waste/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ wastename });
      }

      const response = await request(app)
        .get('/api/dashboard/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bioVsNonBioPercentage.biodegradable).toBe(60);
      expect(response.body.data.bioVsNonBioPercentage["non-biodegradable"]).toBe(40);
      expect(response.body.data.binUsagePercentage.green).toBe(60);
      expect(response.body.data.binUsagePercentage.blue).toBe(20);
      expect(response.body.data.binUsagePercentage.black).toBe(20);
      expect(response.body.data.totalClassificationsOverTime).toHaveLength(1);
      expect(response.body.data.totalClassificationsOverTime[0].count).toBe(15);
      expect(response.body.message).toBe('success');
    });

    it('should handle only biodegradable items', async () => {
      // Create only biodegradable items
      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'apple' });

      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'banana peel' });

      const response = await request(app)
        .get('/api/dashboard/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bioVsNonBioPercentage.biodegradable).toBe(100);
      expect(response.body.data.bioVsNonBioPercentage["non-biodegradable"]).toBe(0);
      expect(response.body.data.binUsagePercentage.green).toBe(100);
      expect(response.body.data.binUsagePercentage.blue).toBe(0);
      expect(response.body.data.binUsagePercentage.black).toBe(0);
      expect(response.body.message).toBe('success');
    });

    it('should return valid data structure for all fields', async () => {
      await request(app)
        .post('/api/waste/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ wastename: 'apple' });

      const response = await request(app)
        .get('/api/dashboard/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('bioVsNonBioPercentage');
      expect(response.body.data).toHaveProperty('binUsagePercentage');
      expect(response.body.data).toHaveProperty('totalClassificationsOverTime');
      
      expect(response.body.data.bioVsNonBioPercentage).toHaveProperty('biodegradable');
      expect(response.body.data.bioVsNonBioPercentage).toHaveProperty('non-biodegradable');
      
      expect(response.body.data.binUsagePercentage).toHaveProperty('green');
      expect(response.body.data.binUsagePercentage).toHaveProperty('blue');
      expect(response.body.data.binUsagePercentage).toHaveProperty('black');
      
      expect(Array.isArray(response.body.data.totalClassificationsOverTime)).toBe(true);
    });
  });
});
