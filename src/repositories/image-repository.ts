import { Image, Prisma } from '@prisma/client'

export interface ImageRepository {
  create(data: Prisma.ImageUncheckedCreateInput): Promise<Image>
  getByPetId(petId: string): Promise<Image[] | null>
}
