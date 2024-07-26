import { InMemoryOrgRepository } from '@/repositories/in-memory-repository/org-in-memory-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrgUseCase } from './create-org'
import { OrgRepository } from '@/repositories/org-repository'
import { compare } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

describe('Create Org Use Case', () => {
  let orgRepository: OrgRepository
  let sut: CreateOrgUseCase

  beforeEach(() => {
    orgRepository = new InMemoryOrgRepository()
    sut = new CreateOrgUseCase(orgRepository)
  })

  it('Should be able to hash the password', async () => {
    const { org } = await sut.execute({
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password: '123456',
      cep: '9999999',
      city: 'Piraracuiba',
      state: 'SP',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    })

    const isPasswordHashed = await compare('123456', org.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('Should not be able to create two orgs with same email', async () => {
    await sut.execute({
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password: '123456',
      cep: '9999999',
      city: 'Piraracuiba',
      state: 'SP',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    })

    expect(
      sut.execute({
        name: 'Sample Organization',
        email: 'SampleOrg@gmail.com',
        phone: '11999999999',
        password: '123456',
        cep: '9999999',
        city: 'Piraracuiba',
        state: 'SP',
        neighborhood: 'Bairro 02',
        street: 'Rua dos Bobos',
        number: '0',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })

  it('Should be able to create a org', async () => {
    const { org } = await sut.execute({
      name: 'Sample Organization',
      email: 'SampleOrg@gmail.com',
      phone: '11999999999',
      password: '123456',
      cep: '9999999',
      city: 'Piraracuiba',
      state: 'SP',
      neighborhood: 'Bairro 02',
      street: 'Rua dos Bobos',
      number: '0',
    })

    expect(org.id).toEqual(expect.any(String))
  })
})
