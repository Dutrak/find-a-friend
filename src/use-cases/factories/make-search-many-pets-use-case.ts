import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma-repository'
import { SearchManyPetsUseCase } from '../search-many-pets'

export function makeSearchManyPetsUseCase() {
  const petRepository = new PrismaPetRepository()
  return new SearchManyPetsUseCase(petRepository)
}
