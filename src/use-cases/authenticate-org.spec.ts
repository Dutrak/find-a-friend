import { InMemoryOrgRepository } from '@/repositories/in-memory-repository/org-in-memory-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgRepository } from '@/repositories/org-repository'
import { AuthenticateOrgUseCase } from './authenticate-org'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Org Use Case', () => {
  let orgRepository: OrgRepository
  let sut: AuthenticateOrgUseCase

  beforeEach(async () => {
    orgRepository = new InMemoryOrgRepository()
    sut = new AuthenticateOrgUseCase(orgRepository)

    await orgRepository.create({
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

  it('Should not be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'wrongemail@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    expect(() =>
      sut.execute({
        email: 'SampleOrg@gmail.com',
        password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should be able to authenticate with correct credentials', async () => {
    const { org } = await sut.execute({
      email: 'SampleOrg@gmail.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })
})
