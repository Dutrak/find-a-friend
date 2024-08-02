import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetRepository } from '@/repositories/in-memory-repository/pet-in-memory-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { CreatePetUseCase } from './create-pet'
import { OrgRepository } from '@/repositories/org-repository'
import { hash } from 'bcryptjs'
import { InMemoryOrgRepository } from '@/repositories/in-memory-repository/org-in-memory-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PetInsuficientImageError } from './errors/pet-insuficient-images-error'
import { PetInsuficientRequirementError } from './errors/pet-insuficient-requirement-error'

describe('Create Pet Use Case', () => {
  let orgRepository: OrgRepository
  let petRepository: PetRepository
  let sut: CreatePetUseCase

  beforeEach(async () => {
    petRepository = new InMemoryPetRepository(orgRepository)
    orgRepository = new InMemoryOrgRepository()
    sut = new CreatePetUseCase(petRepository, orgRepository)

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

  it('Should be able to create a new pet', async () => {
    const { pet } = await sut.execute({
      name: 'Cattito',
      about: 'My little best cat friend',
      age: '10',
      energyLevel: 'low',
      size: 'medium',
      independencyLevel: 'high',
      environment: 'Home',
      orgId: 'org-01',
      images: ['catitotest.jpg'],
      requirements: ['A large Home'],
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('Should not be able to create a pet with no images', async () => {
    expect(
      sut.execute({
        name: 'Cattito',
        about: 'My little best cat friend',
        age: '10',
        energyLevel: 'low',
        size: 'medium',
        independencyLevel: 'high',
        environment: 'Home',
        orgId: 'org-01',
        images: [],
        requirements: ['A large Home'],
      }),
    ).rejects.toBeInstanceOf(PetInsuficientImageError)
  })

  it('Should not be able to create a pet with no requirements', async () => {
    expect(
      sut.execute({
        name: 'Cattito',
        about: 'My little best cat friend',
        age: '10',
        energyLevel: 'low',
        size: 'medium',
        independencyLevel: 'high',
        environment: 'Home',
        orgId: 'org-01',
        images: ['catito.jpg'],
        requirements: [],
      }),
    ).rejects.toBeInstanceOf(PetInsuficientRequirementError)
  })

  it('Should not be able to create a pet with non existent org', async () => {
    expect(
      sut.execute({
        name: 'Cattito',
        about: 'My little best cat friend',
        age: '10',
        energyLevel: 'low',
        size: 'medium',
        independencyLevel: 'high',
        environment: 'Home',
        orgId: 'non-existent-org',
        images: ['catitotest.jpg'],
        requirements: ['A large Home'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
