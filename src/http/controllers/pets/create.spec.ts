import { app } from '@/http/app'
import { createAndAuthenticateOrg } from '@/utils/tests/create-and-authenticate-org'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a Pet', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const imagePath = path.join(__dirname, '../../../utils/tests/example.png')
    const imageBuffer = readFileSync(imagePath)

    const response = await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Catitto Big')
      .field('about', 'My Little best cat friend')
      .field('age', '10')
      .field('energyLevel', 'low')
      .field('size', 'giant')
      .field('independencyLevel', 'high')
      .field('environment', 'home')
      .field('requirements', '["A large Home","Attention 24 hours"]')
      .attach('image', imageBuffer, 'example.jpg')

    expect(response.statusCode).toEqual(201)
    expect(response.body.pet.id).toEqual(expect.any(String))
  })
})
