export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string | null
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
}

// Re-export DTOs from API client for convenience
export type { PokemonResponseDto, PokemonDetailResponseDto } from "@/lib/api-client"
