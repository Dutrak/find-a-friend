import { OrgRepository } from '@/repositories/org-repository'
import { PetData, PetRepository } from '@/repositories/pet-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PetInsuficientImageError } from './errors/pet-insuficient-images-error'
import { PetInsuficientRequirementError } from './errors/pet-insuficient-requirement-error'

interface CreatePetRequest {
  name: string
  about: string
  age: string
  energyLevel: string
  size: string
  independencyLevel: string
  environment: string
  orgId: string
  images: string[] | null
  requirements: string[] | null
}

interface CreatePetResponse {
  pet: PetData
}

export class CreatePetUseCase {
  constructor(
    private petRepository: PetRepository,
    private orgRepository: OrgRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    energyLevel,
    size,
    independencyLevel,
    environment,
    orgId,
    images,
    requirements,
  }: CreatePetRequest): Promise<CreatePetResponse> {
    const org = await this.orgRepository.getById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    if (!images || images.length === 0 || images[0] === '') {
      throw new PetInsuficientImageError()
    }

    if (!requirements || requirements.length === 0 || requirements[0] === '') {
      throw new PetInsuficientRequirementError()
    }

    const pet = await this.petRepository.create({
      name,
      about,
      age,
      energy_level: energyLevel,
      size,
      independency_level: independencyLevel,
      environment,
      org_id: orgId,
      images,
      requirements,
    })

    return {
      pet,
    }
  }
}
