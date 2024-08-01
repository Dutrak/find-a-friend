import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createOrg(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string().min(3),
    about: z.string(),
    age: z.coerce.string(),
    energyLevel: z.enum(['very low', 'low', 'normal', 'high', 'very high']),
    size: z.coerce.string(),
    independencyLevel: z.enum(['low', 'medium', 'high']),
    environment: z.string(),
    orgId: z.string().uuid(),
    images: z.array(z.string().url()),
    requirements: z.array(z.string()),
  })

  const {
    name,
    about,
    age,
    energyLevel,
    size,
    independencyLevel,
    environment,
    orgId,
    images,
    requirements,
  } = createOrgBodySchema.parse(request.body)

  try {
    const useCase = makeCreatePetUseCase()
    const { pet } = await useCase.execute({
      name,
      about,
      age,
      energyLevel,
      size,
      independencyLevel,
      environment,
      orgId,
      images,
      requirements,
    })

    return reply.status(201).send({ pet })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
