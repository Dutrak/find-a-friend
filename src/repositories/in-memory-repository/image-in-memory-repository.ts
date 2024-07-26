import { randomUUID } from 'node:crypto'
import { Image, Prisma } from '@prisma/client'
import { ImageRepository } from '../image-repository'

export class InMemoryImageRepository implements ImageRepository {
  public items: Image[] = []

  constructor() {}

  async create(data: Prisma.ImageUncheckedCreateInput) {
    const image = {
      id: randomUUID(),
      image_url: data.image_url,
      pet_id: data.pet_id,
    }
    this.items.push(image)

    return image
  }

  async getByPetId(petId: string) {
    const image = this.items.filter((value) => value.pet_id === petId)

    return image
  }
}
