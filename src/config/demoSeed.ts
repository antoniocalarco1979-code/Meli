/** Demo seed attivo solo con VITE_DEMO_SEED=true in .env */
export function shouldSeedDemoData(): boolean {
  return import.meta.env.VITE_DEMO_SEED === 'true'
}
