import { OrgRepository } from '../repositories/org-repository'
import { Org } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateOrgRequest {
  email: string
  password: string
}

interface AuthenticateOrgResponse {
  org: Org
}

export class AuthenticateOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOrgRequest): Promise<AuthenticateOrgResponse> {
    const org = await this.orgRepository.getByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, org.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
