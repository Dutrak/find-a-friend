import { randomUUID } from 'node:crypto'
import { Requirement, Prisma } from '@prisma/client'
import { RequirementRepository } from '../requirement-repository'

export class InMemoryRequirementRepository implements RequirementRepository {
  public items: Requirement[] = []

  constructor() {}

  async create(data: Prisma.RequirementUncheckedCreateInput) {
    const requirement = {
      id: randomUUID(),
      description: data.description,
      pet_id: data.pet_id,
    }
    this.items.push(requirement)

    return requirement
  }

  async getByPetId(petId: string) {
    const requirement = this.items.filter((value) => value.pet_id === petId)

    return requirement
  }
}
