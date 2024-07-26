import { OrgRepository } from '../repositories/org-repository'
import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

interface CreateOrgRequest {
  name: string
  email: string
  phone: string
  password: string
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
}

interface CreateOrgResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    name,
    email,
    phone,
    password,
    cep,
    state,
    city,
    neighborhood,
    street,
    number,
  }: CreateOrgRequest): Promise<CreateOrgResponse> {
    const passwordHash = await hash(password, 6)

    const orgWithSameEmail = await this.orgRepository.getByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgRepository.create({
      name,
      email,
      phone,
      password_hash: passwordHash,
      cep,
      state,
      city,
      neighborhood,
      street,
      number,
    })

    return {
      org,
    }
  }
}
