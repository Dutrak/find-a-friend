import { env } from '@/env'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { orgsRoutes } from './controllers/orgs/routes'
import { petsRoutes } from './controllers/pets/routes'
import multer from 'fastify-multer'
import { fastifyStatic } from '@fastify/static'
import path from 'node:path'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(multer.contentParser)
app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'tmp'),
  prefix: '/images/',
})

app.register(orgsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  } else {
    // TODO: Log to external tool like Datadog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
