import { FastifyInstance } from 'fastify'
import { createPet } from './create'
import { listPet } from './list'
import { SearchManyPets } from './search-many'
import { verfifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:id', listPet)
  app.get('/pets', SearchManyPets)

  app.post('/orgs/pets', { onRequest: [verfifyJWT] }, createPet)
}
