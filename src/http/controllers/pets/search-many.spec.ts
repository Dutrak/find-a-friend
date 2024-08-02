import { app } from '@/http/app'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import { createPetWithImageAndRequirement } from '@/utils/tests/create-pet-with-images-and-requirements'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Many Pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to Search Pets by Query params', async () => {
    const { token } = await createAndAuthenticateOrg(app)
    const { pet } = await createPetWithImageAndRequirement(app, token)

    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'Piraracuiba', size: 'giant' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets[0].id).toBe(pet.id)
  })
})
