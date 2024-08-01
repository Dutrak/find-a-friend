import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma-repository'
import { AuthenticateOrgUseCase } from '../authenticate-org'

export function makeAuthenticateOrgUseCase() {
  const orgRepository = new PrismaOrgRepository()
  return new AuthenticateOrgUseCase(orgRepository)
}
