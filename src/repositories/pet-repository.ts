import { Prisma, Pet } from '@prisma/client'

export interface QueryParams {
  age: string
  energyLevel: string
  size: string
  independencyLevel: string
  environment: string
}

export interface PetRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  searchMany(city: string, query?: QueryParams): Promise<Pet[] | null>
  getById(id: string): Promise<Pet | null>
}
