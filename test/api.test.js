require('dotenv').config();  
const request = require('supertest');
const app = require('../src/app');  
const prisma = require('../src/prismaClient'); 

describe('User API', () => {
  beforeAll(async () => {
    await app.ready();  

    
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();  
    app.close();  
  });

  it('should register a user successfully', async () => {
    const response = await request(app.server)
      .post('/auth/register')
      .send({
        name: 'Test User', 
        email: 'testuser@example.com', 
        password: 'password123',
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('token'); 
  });

  it('should login a user and return a token', async () => {
    
    await request(app.server)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com', 
        password: 'password123',
      });

    
    const response = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'testuser@example.com', 
        password: 'password123',
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('token'); 
  });
});
