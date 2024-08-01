import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma-repository'
import { ListPetUseCase } from '../list-pet'

export function makeListPetUseCase() {
  const petRepository = new PrismaPetRepository()
  return new ListPetUseCase(petRepository)
}
