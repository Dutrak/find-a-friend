import { randomUUID } from 'crypto'
import { CreatePetData, PetRepository, QueryParams } from '../pet-repository'
import { Image, Pet, Requirement } from '@prisma/client'
import { OrgRepository } from '../org-repository'

export class InMemoryPetRepository implements PetRepository {
  public pets: Pet[] = []
  public images: Image[] = []
  public requirements: Requirement[] = []

  constructor(private orgRepository: OrgRepository) {}

  async create(data: CreatePetData) {
    const pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      energy_level: data.energy_level,
      environment: data.environment,
      independency_level: data.independency_level,
      size: data.size,
      org_id: data.org_id,
    }

    this.pets.push(pet)

    if (data.images) {
      for (const imageUrl of data.images) {
        const image = {
          id: randomUUID(),
          image_url: imageUrl,
          pet_id: pet.id,
        }
        this.images.push(image)
      }
    }

    if (data.requirements) {
      for (const requirementData of data.requirements) {
        const requirement = {
          id: randomUUID(),
          description: requirementData,
          pet_id: pet.id,
        }
        this.requirements.push(requirement)
      }
    }

    return {
      ...pet,
      images: this.images.filter((value) => value.id === pet.id),
      requirements: this.requirements.filter((value) => value.id === pet.id),
    }
  }

  async searchMany(city: string, query: QueryParams) {
    const orgsByCity = await this.orgRepository.getByCity(city)

    const returnedValue = []

    const pets = this.pets
      .filter(
        (value) => orgsByCity?.some((org) => org.id === value.org_id) ?? true,
      )
      .filter((value) =>
        query?.energyLevel ? query.energyLevel === value.energy_level : true,
      )
      .filter((value) =>
        query?.environment ? query.environment === value.environment : true,
      )
      .filter((value) => (query?.age ? query.age === value.age : true))
      .filter((value) =>
        query?.independencyLevel
          ? query?.independencyLevel === value.independency_level
          : true,
      )
      .filter((value) => (query?.size ? query.size === value.size : true))

    for (const pet of pets) {
      const images = this.images.filter((value) => value.id === pet.id)
      const requirements = this.requirements.filter(
        (value) => value.id === pet.id,
      )
      const petData = { ...pet, images, requirements }
      returnedValue.push(petData)
    }

    return returnedValue
  }

  async getById(id: string) {
    const pet = this.pets.filter((value) => value.id === id)[0]

    if (!pet) {
      return null
    }

    return {
      ...pet,
      images: this.images.filter((value) => value.id === pet.id),
      requirements: this.requirements.filter((value) => value.id === pet.id),
    }
  }
}
