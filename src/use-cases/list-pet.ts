import { PetData, PetRepository } from '@/repositories/pet-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ListPetRequest {
  id: string
}

interface ListPetResponse {
  pet: PetData
}

export class ListPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ id }: ListPetRequest): Promise<ListPetResponse> {
    const pet = await this.petRepository.getById(id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return { pet }
  }
}
