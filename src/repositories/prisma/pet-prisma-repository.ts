import { prisma } from '@/lib/prisma'
import { CreatePetData, PetRepository, QueryParams } from '../pet-repository'

export class PrismaPetRepository implements PetRepository {
  async create(data: CreatePetData) {
    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        about: data.about,
        age: data.age,
        size: data.size,
        energy_level: data.energy_level,
        environment: data.environment,
        independency_level: data.independency_level,
        org_id: data.org_id,
        images: {
          create: data.images?.map((url) => ({
            image_url: url,
          })),
        },
        requirements: {
          create: data.requirements?.map((description) => ({
            description,
          })),
        },
      },
    })

    const images = await prisma.image.findMany({ where: { pet_id: pet.id } })
    const requirements = await prisma.requirement.findMany({
      where: { pet_id: pet.id },
    })

    return {
      ...pet,
      images,
      requirements,
    }
  }

  async searchMany(city: string, query?: QueryParams) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city,
        },
        AND: [
          {
            age: query?.age,
            energy_level: query?.energyLevel,
            independency_level: query?.independencyLevel,
            environment: query?.environment,
            size: query?.size,
          },
        ],
      },
    })

    return Promise.all(
      pets.map(async (pet) => {
        const images = await prisma.image.findMany({
          where: { pet_id: pet.id },
        })

        const requirements = await prisma.requirement.findMany({
          where: { pet_id: pet.id },
        })

        return { ...pet, images, requirements }
      }),
    )
  }

  async getById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: { id },
    })

    if (!pet) {
      return null
    }

    const images = await prisma.image.findMany({ where: { pet_id: pet.id } })
    const requirements = await prisma.requirement.findMany({
      where: { pet_id: pet.id },
    })

    return {
      ...pet,
      images,
      requirements,
    }
  }
}
