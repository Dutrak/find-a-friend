import { FastifyInstance } from 'fastify'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import request from 'supertest'

export async function createPetWithImageAndRequirement(
  app: FastifyInstance,
  token: string,
) {
  const imagePath = path.join(__dirname, './example.png')
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

  const { pet } = response.body
  return { pet }
}
