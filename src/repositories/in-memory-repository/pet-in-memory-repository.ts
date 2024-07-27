import { randomUUID } from 'crypto'
import {
  CreatePetData,
  PetData,
  PetRepository,
  QueryParams,
} from '../pet-repository'
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

  async searchMany(city: string, query?: QueryParams) {
    const orgsByCity = await this.orgRepository.getByCity(city)

    const returnedValue: PetData[] = []

    const pets = this.pets
      .filter((value) => orgsByCity?.some((org) => org.id === value.org_id))
      .filter((value) => value.energy_level === query?.energyLevel ?? true)
      .filter((value) => value.environment === query?.environment ?? true)
      .filter((value) => value.age === query?.age ?? true)
      .filter(
        (value) => value.energy_level === query?.independencyLevel ?? true,
      )
      .filter((value) => value.size === query?.size ?? true)

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

    return {
      ...pet,
      images: this.images.filter((value) => value.id === pet.id),
      requirements: this.requirements.filter((value) => value.id === pet.id),
    }
  }
}
