const request = require('supertest');
const app = require('../index');

describe('Root Route', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toBe('Welcome to the binbot API');
    });
  });
});
