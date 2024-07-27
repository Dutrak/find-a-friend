import { Prisma, Image, Requirement } from '@prisma/client'

export interface QueryParams {
  age?: string
  energyLevel?: string
  size?: string
  independencyLevel?: string
  environment?: string
}

export interface CreatePetData extends Prisma.PetCreateManyInput {
  images: string[] | null
  requirements: string[] | null
}

export interface PetData extends Prisma.PetCreateManyInput {
  id: string
  images: Image[] | null
  requirements: Requirement[] | null
}

export interface PetRepository {
  create(data: CreatePetData): Promise<PetData>
  searchMany(city: string, query?: QueryParams): Promise<PetData[]>
  getById(id: string): Promise<PetData | null>
}
