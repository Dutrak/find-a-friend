import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await prisma.org.create({
    data: {
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password_hash: await hash('123456', 6),
      cep: '9999999',
      city: 'Piraracuiba',
      state: 'SP',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    },
  })

  const authResponse = await request(app.server).post('/orgs/sessions').send({
    email: 'SampleOrg@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body
  return { token }
}
