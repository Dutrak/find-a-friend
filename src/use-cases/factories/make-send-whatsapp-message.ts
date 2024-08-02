import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma-repository'
import { SendWhatsAppMessageUseCase } from '../send-whatsapp-message'
import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma-repository'

export function makeSendWhatsAppMessageUseCase() {
  const petRepository = new PrismaPetRepository()
  const orgRepository = new PrismaOrgRepository()
  return new SendWhatsAppMessageUseCase(orgRepository, petRepository)
}
