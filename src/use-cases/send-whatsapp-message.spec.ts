import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetRepository } from '@/repositories/in-memory-repository/pet-in-memory-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { OrgRepository } from '@/repositories/org-repository'
import { SendWhatsAppMessageUseCase } from './send-whatsapp-message'
import { InMemoryOrgRepository } from '@/repositories/in-memory-repository/org-in-memory-repository'
import { hash } from 'bcryptjs'

describe('Get a Pet Use Case', () => {
  let orgRepository: OrgRepository
  let petRepository: PetRepository
  let sut: SendWhatsAppMessageUseCase

  beforeEach(async () => {
    orgRepository = new InMemoryOrgRepository()
    petRepository = new InMemoryPetRepository(orgRepository)
    sut = new SendWhatsAppMessageUseCase(orgRepository, petRepository)

    orgRepository.create({
      id: 'org-01',
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password_hash: await hash('123456', 6),
      cep: '9999999',
      city: 'Piraracuiba',
      state: 'SP',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    })
  })

  it('Should be able to get the whatsapp message link', async () => {
    const createdPet = await petRepository.create({
      name: 'Cattito',
      about: 'My little best cat friend',
      age: '10',
      energy_level: 'low',
      size: 'medium',
      independency_level: 'high',
      environment: 'Home',
      org_id: 'org-01',
      images: ['src/catitotest'],
      requirements: ['A large Home'],
    })

    const org = await orgRepository.getById(createdPet.org_id)
    const { message } = await sut.execute({ petId: createdPet.id })

    console.log(message)
    expect(message).toEqual(
      encodeURI(
        `https://wa.me/${org?.phone}?text=Olá ${org?.name}, gostaria de informar que vi o anúncio do ${createdPet?.name} na plataforma Find a Friend e tenho interesse na possibilidade de adoção`,
      ),
    )
  })
})
