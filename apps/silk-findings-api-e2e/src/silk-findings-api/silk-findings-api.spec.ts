import axios from 'axios';

describe('GET /api/findings', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api/findings`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Welcome to silk-findings-api!' });
  });
});
