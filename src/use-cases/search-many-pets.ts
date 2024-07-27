import {
  PetData,
  PetRepository,
  QueryParams,
} from '@/repositories/pet-repository'

interface SearchManyPetsRequest {
  city: string
  query?: QueryParams
}

interface SearchManyPetsResponse {
  pets: PetData[]
}

export class SearchManyPetsUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    city,
    query,
  }: SearchManyPetsRequest): Promise<SearchManyPetsResponse> {
    const pets = await this.petRepository.searchMany(city, query)

    return { pets }
  }
}
