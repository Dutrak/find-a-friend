import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string().min(3),
    about: z.string(),
    age: z.coerce.string(),
    energyLevel: z.enum(['very low', 'low', 'normal', 'high', 'very high']),
    size: z.coerce.string(),
    independencyLevel: z.enum(['low', 'medium', 'high']),
    environment: z.string(),
    requirements: z.string(),
  })

  const body = createOrgBodySchema.parse(request.body)
  const orgId = request.user.sub

  try {
    const useCase = makeCreatePetUseCase()

    const images = request.files.map((file) => file.filename) as string[] | null
    const requirements: string[] | null = JSON.parse(body.requirements)

    const { pet } = await useCase.execute({
      ...body,
      images,
      requirements,
      orgId,
    })

    return reply.status(201).send({ pet })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
