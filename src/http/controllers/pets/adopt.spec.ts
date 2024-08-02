import { app } from '@/http/app'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import { createPetWithImageAndRequirement } from '@/utils/tests/create-pet-with-images-and-requirements'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Adopt Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to get a whatsapp link to Adopt a pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)
    const { pet } = await createPetWithImageAndRequirement(app, token)

    const response = await request(app.server).get(`/pets/${pet.id}/adopt`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual(expect.any(String))
  })
})
