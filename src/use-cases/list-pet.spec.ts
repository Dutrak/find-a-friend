import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetRepository } from '@/repositories/in-memory-repository/pet-in-memory-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { OrgRepository } from '@/repositories/org-repository'
import { ListPetUseCase } from './list-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get a Pet Use Case', () => {
  let orgRepository: OrgRepository
  let petRepository: PetRepository
  let sut: ListPetUseCase

  beforeEach(async () => {
    petRepository = new InMemoryPetRepository(orgRepository)
    sut = new ListPetUseCase(petRepository)
  })

  it('Should be able to get a pet by id', async () => {
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

    const { pet } = await sut.execute({ id: createdPet.id })

    expect(pet).toEqual(createdPet)
  })

  it('Should not be able to get a pet by wrong id', async () => {
    await petRepository.create({
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

    expect(sut.execute({ id: 'wrong-id' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
