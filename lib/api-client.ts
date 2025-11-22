// This client provides type-safe access to all Pokemon Manager API endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// DTO Types - Generated from Swagger schemas
export interface PokemonResponseDto {
  id: number
  name: string
  sprite: string
}

export interface PokemonListResponseDto {
  data: PokemonResponseDto[]
  total: number
}

export interface PokemonDetailResponseDto {
  id: number
  name: string
  sprite: string
  types: string[]
  abilities: string[]
  evolutionChain: string[]
}

export interface PokemonDetailWrapperDto {
  data: PokemonDetailResponseDto
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

// API Client Functions
export const pokemonApi = {
  // Get all first 150 Pokemon
  async getAllPokemon(): Promise<PokemonListResponseDto> {
    const response = await fetch(`${API_BASE_URL}/pokemon`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch Pokemon list")
    }
    return response.json()
  },

  // Search Pokemon by name
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

  // Get detailed Pokemon information
  async getPokemonById(id: number): Promise<PokemonDetailWrapperDto> {
    const response = await fetch(`${API_BASE_URL}/pokemon/${id}`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch Pokemon details")
    }
    return response.json()
  },

  // Get all favorite Pokemon
  async getFavorites(): Promise<Favorite[]> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/list`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch favorites")
    }
    return response.json()
  },

  // Get favorite Pokemon IDs for quick lookup
  async getFavoriteIds(): Promise<FavoriteIdsResponseDto> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/ids`)
    if (!response.ok) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to fetch favorite IDs")
    }
    return response.json()
  },

  // Add Pokemon to favorites
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

  // Remove Pokemon from favorites
  async removeFavorite(pokemonId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pokemon/favorites/${pokemonId}`, {
      method: "DELETE",
    })
    if (!response.ok && response.status !== 204) {
      const error: ErrorResponseDto = await response.json()
      throw new Error(error.message || "Failed to remove favorite")
    }
  },

  // Reset all favorites
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
