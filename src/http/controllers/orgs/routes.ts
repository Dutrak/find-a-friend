import { FastifyInstance } from 'fastify'
import { createOrg } from './create'
import { authenticateOrg } from './authenticate'

export async function OrgRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrg)
  app.post('/sessions', authenticateOrg)
}
