export class PetInsuficientRequirementError extends Error {
  constructor() {
    super('Pet Should have at least 1 requirement')
  }
}
