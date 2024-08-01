import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma-repository'
import { CreatePetUseCase } from '../create-pet'
import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma-repository'

export function makeCreatePetUseCase() {
  const petRepository = new PrismaPetRepository()
  const orgRepository = new PrismaOrgRepository()
  return new CreatePetUseCase(petRepository, orgRepository)
}
