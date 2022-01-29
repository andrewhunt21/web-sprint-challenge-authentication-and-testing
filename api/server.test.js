// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

test('NODE_ENV is correct', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

describe('Post /register', () => {
  test('returns status 201', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'testUser', password: '1234' })
    expect(res.status).toBe(201)
  })
  test('returns the new user object', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'testUser2', password: '1234' })
    expect(res.body.id).toBe(2)
    expect(res.body.username).toBe('testUser2')
    expect(res.body.password).toBeDefined()
  })
})

describe('Post /login', () => {
  test('returns status 200', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testUser', password: '1234' })
    expect(res.status).toBe(200)
  })
  test('returns succesful login object', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testUser', password: '1234' })
    expect(res.body.message).toBe('welcome, testUser')
    expect(res.body.token).toBeDefined()
  })
})
