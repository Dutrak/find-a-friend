import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeSearchManyPetsUseCase } from '@/use-cases/factories/make-search-many-pets-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function SearchManyPets(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const SearchManyPetsQueryParamsSchema = z.object({
    city: z.string(),
    age: z.coerce.string().optional(),
    energyLevel: z
      .enum(['very low', 'low', 'normal', 'high', 'very high'])
      .optional(),
    size: z.string().optional(),
    independencyLevel: z.enum(['low', 'medium', 'high']).optional(),
    environment: z.string().optional(),
  })

  const { city, ...query } = SearchManyPetsQueryParamsSchema.parse(
    request.query,
  )

  try {
    const useCase = makeSearchManyPetsUseCase()
    const { pets } = await useCase.execute({ city, query })

    return reply.status(200).send({ pets })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
