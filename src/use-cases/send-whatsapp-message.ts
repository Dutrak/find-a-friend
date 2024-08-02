import { PetRepository } from '@/repositories/pet-repository'
import { OrgRepository } from '../repositories/org-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface SendWhatsAppMessageRequest {
  petId: string
}

interface SendWhatsAppMessageResponse {
  message: string
}

export class SendWhatsAppMessageUseCase {
  constructor(
    private orgRepository: OrgRepository,
    private petRepository: PetRepository,
  ) {}

  async execute({
    petId,
  }: SendWhatsAppMessageRequest): Promise<SendWhatsAppMessageResponse> {
    const pet = await this.petRepository.getById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const org = await this.orgRepository.getById(pet.org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const message = `Olá ${org.name}, gostaria de informar que vi o anúncio do ${pet.name} na plataforma Find a Friend e tenho interesse na possibilidade de adoção`

    return { message: encodeURI(`https://wa.me/${org.phone}?text=${message}`) }
  }
}
