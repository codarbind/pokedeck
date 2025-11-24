"use client"
import { Pagination } from "./pagination"
import { PokemonCard } from "./pokemon-card"
import type { PokemonResponseDto } from "@/lib/api-client"

interface PokemonGridProps {
  pokemon: PokemonResponseDto[]
  favorites: number[]
  loading: boolean
  error: string | null
  onSelectPokemon: (pokemon: PokemonResponseDto) => void
  onToggleFavorite: (id: number) => void
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
  loadingPokemonId: number
}

export function PokemonGrid({
  pokemon,
  favorites,
  loading,
  error,
  onSelectPokemon,
  onToggleFavorite,
  currentPage,
  totalPages,
  onPageChange,
  loadingPokemonId
}: PokemonGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-max">
        {pokemon.map((poke) => (
          <PokemonCard
            key={poke.id}
            pokemon={poke}
            isFavorite={favorites.includes(poke.id)}
            onSelect={onSelectPokemon}
            onToggleFavorite={onToggleFavorite}
            isLoading={loadingPokemonId === poke.id}
          />
        ))}
      </div>

      {pokemon.length === 0 && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-500 dark:text-slate-400">No Pokémon found</p>
        </div>
      )}

      {/* Pagination Component */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
    </div>
  )
}
