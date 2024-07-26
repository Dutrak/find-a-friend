import { Requirement, Prisma } from '@prisma/client'

export interface RequirementRepository {
  create(data: Prisma.RequirementUncheckedCreateInput): Promise<Requirement>
  getByPetId(petId: string): Promise<Requirement[] | null>
}
