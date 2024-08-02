export class PetInsuficientImageError extends Error {
  constructor() {
    super('Pet Should have at least 1 image')
  }
}
