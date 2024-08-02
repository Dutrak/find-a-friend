import { app } from '@/http/app'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import { createPetWithImageAndRequirement } from '@/utils/tests/create-pet-with-images-and-requirements'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('List Single Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to List a Single Pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)
    const { pet } = await createPetWithImageAndRequirement(app, token)

    const response = await request(app.server).get(`/pets/${pet.id}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet.id).toBe(pet.id)
  })
})
