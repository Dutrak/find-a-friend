import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateOrgUseCase } from '@/use-cases/factories/make-authenticate-org-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticateOrg(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  })

  const body = authenticateBodySchema.parse(request.body)

  try {
    const useCase = makeAuthenticateOrgUseCase()
    const { org } = await useCase.execute({ ...body })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
        },
      },
    )

    return reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
