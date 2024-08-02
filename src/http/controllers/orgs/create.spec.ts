import { app } from '@/http/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a new Org', async () => {
    const response = await request(app.server).post('/orgs').send({
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

    expect(response.statusCode).toEqual(201)
  })
})
