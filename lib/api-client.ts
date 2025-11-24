import { StringDecoder } from "string_decoder"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://1fbf2e713837.ngrok-free.app"

export interface PokemonResponseDto {
  id: number
  name: string
  sprite: string
}

export interface PokemonListResponseDto {
  data: PokemonResponseDto[]
  total: number
  page?: number
  perPage?: number
}

export interface StatDto {
  name: string
  value: number
}

export interface EvolutionStageDto {
  name: string
  sprite: string
  types: string[]
  method: string
  details: string
  trigger: string
  requirements: string
}

export interface PokemonDetailResponseDto {
  id: number
  name: string
  sprite: string
  types: string[]
  abilities: string[]
  stats: StatDto[]
  height: number
  weight: number
  evolutionChain: EvolutionStageDto[]
}

export interface EvolutionStepDto {
  id: number
  name: string
  sprite: string
  types: string[]
  trigger: string
  requirements: string
}

export interface EvolutionChainResponseDto {
  chain: EvolutionStageDto[] //EvolutionStepDto[]
}

export interface Favorite {
  pokemonId: number
  name: string
  sprite: string
  createdAt: string
  updatedAt: string
}

export interface AddFavoriteDto {
  pokemonId: number
}

export interface SuccessResponseDto {
  success: boolean
  message: string
  data?: Favorite
}

export interface ErrorResponseDto {
  success: boolean
  statusCode: number
  timestamp: string
  path: string
  message: string
}

export interface FavoriteIdsResponseDto {
  data: number[]
}

export const pokemonApi = {
  async getAllPokemon(page = 1, perPage = 12): Promise<PokemonListResponseDto> {
    const params = new URLSearchParams({ page: page.toString(), perPage: perPage.toString() })
    const response = await fetch(`${API_BASE_URL}/pokemon?${params}`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch Pokemon list")
    }
    return response.json()
  },

  async searchPokemon(name?: string): Promise<PokemonListResponseDto> {
    const params = new URLSearchParams()
    if (name && name.length >= 2) {
      params.append("name", name)
    }
    const response = await fetch(`${API_BASE_URL}/pokemon/search?${params}`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to search Pokemon")
    }
    return response.json()
  },

  async getPokemonById(id: number): Promise<{ data: PokemonDetailResponseDto }> {
    const response = await fetch(`${API_BASE_URL}/pokemon/${id}`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch Pokemon details")
    }
    return response.json()
  },

  async getEvolutionChain(id: number): Promise<EvolutionChainResponseDto> {
    const response = await fetch(`${API_BASE_URL}/pokemon/evolution/${id}`)
    if (!response.ok) {
      return { chain: [] }
    }
    return response.json()
  },

  async getFavorites(): Promise<Favorite[]> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/list`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch favorites")
    }
    return response.json()
  },

  async getFavoriteIds(): Promise<FavoriteIdsResponseDto> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/ids`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch favorite IDs")
    }
    return response.json()
  },

  async addFavorite(pokemonId: number): Promise<SuccessResponseDto> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pokemonId } as AddFavoriteDto),
    })
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to add favorite")
    }
    return response.json()
  },

  async removeFavorite(pokemonId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/${pokemonId}`, {
      method: "DELETE",
    })
    if (!response.ok && response.status !== 204) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to remove favorite")
    }
  },

  async resetFavorites(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/reset`, {
      method: "POST",
    })
    if (!response.ok && response.status !== 204) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to reset favorites")
    }
  },
}
