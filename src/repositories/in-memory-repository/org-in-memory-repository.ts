import { randomUUID } from 'node:crypto'
import { OrgRepository } from '../org-repository'
import { Org, Prisma } from '@prisma/client'

export class InMemoryOrgRepository implements OrgRepository {
  public items: Org[] = []

  constructor() {}

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      password_hash: data.password_hash,
      cep: data.cep,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      street: data.street,
      number: data.number,
    }

    this.items.push(org)

    return org
  }

  async getById(id: string) {
    const org = this.items.filter((value) => value.id === id)[0]
    return org
  }

  async getByCity(city: string) {
    const org = this.items.filter((value) => value.city === city)
    return org
  }

  async getByEmail(email: string) {
    const org = this.items.filter((value) => value.email === email)[0]
    return org
  }
}
