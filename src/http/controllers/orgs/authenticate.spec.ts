import { app } from '@/http/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to Authenticate a Org', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password: '123456',
      cep: '9999999',
      city: 'Piraracuiba',
      state: 'SP',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    })

    const response = await request(app.server).post('/orgs/sessions').send({
      email: 'SampleOrg@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })
})
