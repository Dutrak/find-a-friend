import { Prisma, Org } from '@prisma/client'
import { OrgRepository } from '../org-repository'
import { prisma } from '@/lib/prisma'

export class PrismaOrgRepository implements OrgRepository {
  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }

  async getByCity(city: string): Promise<Org[] | null> {
    const org = await prisma.org.findMany({
      where: { city },
    })

    return org
  }

  async getByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: { email },
    })

    return org
  }

  async getById(id: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: { id },
    })

    return org
  }
}
