import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetRepository } from '@/repositories/in-memory-repository/pet-in-memory-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { OrgRepository } from '@/repositories/org-repository'
import { hash } from 'bcryptjs'
import { SearchManyPetsUseCase } from './search-many-pets'
import { InMemoryOrgRepository } from '@/repositories/in-memory-repository/org-in-memory-repository'

describe('Search Many Pets Use Case', () => {
  let orgRepository: OrgRepository
  let petRepository: PetRepository
  let sut: SearchManyPetsUseCase

  beforeEach(async () => {
    orgRepository = new InMemoryOrgRepository()
    petRepository = new InMemoryPetRepository(orgRepository)
    sut = new SearchManyPetsUseCase(petRepository)

    await orgRepository.create({
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

    await orgRepository.create({
      id: 'org-02',
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password_hash: await hash('123456', 6),
      cep: '9999999',
      city: 'Cascavel',
      state: 'PR',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    })
  })

  it('Should be able to search pets by city', async () => {
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

    await petRepository.create({
      name: 'Cattito',
      about: 'My little best cat friend',
      age: '10',
      energy_level: 'low',
      size: 'medium',
      independency_level: 'high',
      environment: 'Home',
      org_id: 'org-02',
      images: ['src/catitotest'],
      requirements: ['A large Home'],
    })

    const { pets } = await sut.execute({ city: 'Cascavel' })

    expect(pets?.length).toEqual(1)
  })

  it('Should be be able to search pets by query params', async () => {
    await petRepository.create({
      name: 'Cattito amiguito',
      about: 'My little best cat friend',
      age: '10',
      energy_level: 'low',
      size: 'medium',
      independency_level: 'high',
      environment: 'home',
      org_id: 'org-01',
      images: ['src/catitotest'],
      requirements: ['A large Home'],
    })

    await petRepository.create({
      name: 'Cattito',
      about: 'My little best cat friend',
      age: '10',
      energy_level: 'low',
      size: 'tall',
      independency_level: 'high',
      environment: 'Home',
      org_id: 'org-02',
      images: ['src/catitotest'],
      requirements: ['A large Home'],
    })

    const { pets } = await sut.execute({
      city: 'Piraracuiba',
      query: {
        age: '10',
        size: 'medium',
      },
    })

    expect(pets?.length).toEqual(1)
    expect(pets[0].name).toEqual('Cattito amiguito')
  })
})
