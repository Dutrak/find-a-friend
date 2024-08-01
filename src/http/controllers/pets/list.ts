import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeListPetUseCase } from '@/use-cases/factories/make-list-pet-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function listPet(request: FastifyRequest, reply: FastifyReply) {
  const listPetParamsSchema = z.object({ id: z.string().uuid() })
  const { id } = listPetParamsSchema.parse(request.params)

  try {
    const useCase = makeListPetUseCase()
    const { pet } = await useCase.execute({ id })

    return reply.status(200).send({ pet })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
