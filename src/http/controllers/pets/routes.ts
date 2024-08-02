import { FastifyInstance } from 'fastify'
import { createPet } from './create'
import { listPet } from './list'
import { SearchManyPets } from './search-many'
import { verfifyJWT } from '@/http/middlewares/verify-jwt'
import { uploadConfig } from '@/config/upload'
import multer from 'fastify-multer'

export async function petsRoutes(app: FastifyInstance) {
  const upload = multer(uploadConfig)

  app.get('/pets/:id', listPet)
  app.get('/pets', SearchManyPets)

  app.post(
    '/orgs/pets',
    { onRequest: [verfifyJWT], preHandler: await upload.array('image', 6) },
    createPet,
  )
}
