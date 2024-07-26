import { randomUUID } from 'crypto'
import { PetRepository, QueryParams } from '../pet-repository'
import { Pet, Prisma } from '@prisma/client'
import { OrgRepository } from '../org-repository'

export class InMemoryPetRepository implements PetRepository {
  public items: Pet[] = []

  constructor(private orgRepository: OrgRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      energy_level: data.energy_level,
      environment: data.environment,
      independency_level: data.independency_level,
      size: data.size,
      org_id: data.org_id,
    }

    this.items.push(pet)

    return pet
  }

  async searchMany(city: string, query?: QueryParams) {
    const orgsByCity = await this.orgRepository.getByCity(city)

    const pet = this.items
      .filter((value) => orgsByCity?.some((org) => org.id === value.org_id))
      .filter((value) => value.energy_level === query?.energyLevel ?? true)
      .filter((value) => value.environment === query?.environment ?? true)
      .filter((value) => value.age === query?.age ?? true)
      .filter(
        (value) => value.energy_level === query?.independencyLevel ?? true,
      )
      .filter((value) => value.size === query?.size ?? true)

    return pet
  }

  async getById(id: string) {
    const pet = this.items.filter((value) => value.id === id)[0]
    return pet
  }
}
