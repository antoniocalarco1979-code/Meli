/** Utility condivise per i repository MELI. */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Timestamp corrente in millisecondi. */
export function now(): number {
  return Date.now()
}
