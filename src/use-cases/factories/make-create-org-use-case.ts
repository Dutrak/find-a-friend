import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma-repository'
import { CreateOrgUseCase } from '../create-org'

export function makeCreateOrgUseCase() {
  const orgRepository = new PrismaOrgRepository()
  return new CreateOrgUseCase(orgRepository)
}
