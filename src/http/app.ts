import { env } from '@/env'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { OrgRoutes } from './controllers/orgs/routes'

export const app = fastify()

