import { Org, Prisma } from '@prisma/client'

export interface OrgRepository {
  create(data: Prisma.OrgCreateInput): Promise<Org>
  getByCity(city: string): Promise<Org[] | null>
  getByEmail(email: string): Promise<Org | null>
  getById(id: string): Promise<Org | null>
}
