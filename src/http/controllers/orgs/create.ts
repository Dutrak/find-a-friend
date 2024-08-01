import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createOrg(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string().min(4),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(4),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    number: z.string(),
  })

  const body = createOrgBodySchema.parse(request.body)

  try {
    const useCase = makeCreateOrgUseCase()
    const { org } = await useCase.execute({ ...body })

    return reply.status(201).send({ org })
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
