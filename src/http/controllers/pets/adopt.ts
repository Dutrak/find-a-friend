import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeSendWhatsAppMessageUseCase } from '@/use-cases/factories/make-send-whatsapp-message'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function AdoptPet(request: FastifyRequest, reply: FastifyReply) {
  const adoptPetParamsSchema = z.object({ id: z.string().uuid() })
  const { id } = adoptPetParamsSchema.parse(request.params)

  try {
    const useCase = makeSendWhatsAppMessageUseCase()
    const { message } = await useCase.execute({ petId: id })

    return reply.status(200).send({ message })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
