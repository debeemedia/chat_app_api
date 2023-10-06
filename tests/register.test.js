const request = require('supertest')
const serverApp = require('../server')
const app = request(serverApp)

describe('POST /users/register', () => {
  test('registers a new user', async () => {
    const response = await app.post('/users/register').send({
      email: 'test@gmail.com',
      username: 'testing',
      password: 'password'
    })
    // console.log(response.status);
    // console.log(response.body);
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('message', 'Registration successful')
    expect(response.body).toHaveProperty('user')
  })
})
