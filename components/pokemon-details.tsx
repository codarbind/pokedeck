"use client"

import { Button } from "@/components/ui/button"
import { Star, ChevronLeft } from "lucide-react"
import type { PokemonDetailResponseDto } from "@/lib/api-client"

interface PokemonDetailsProps {
  pokemon: PokemonDetailResponseDto | null
  isFavorite: boolean
  onToggleFavorite: () => void
  onBack?: () => void
}

export function PokemonDetails({ pokemon, isFavorite, onToggleFavorite, onBack }: PokemonDetailsProps) {
  if (!pokemon) {
    return (
      <div className="hidden md:flex w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <p>Select a Pokémon to view details</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <div className="w-full p-8 space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to List
          </button>
        )}

        {/* Sprite & Name */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={pokemon.sprite || "/placeholder.svg?height=150&width=150"}
            alt={pokemon.name}
            className="w-32 h-32"
          />
          <h1 className="text-4xl font-bold capitalize text-center">{pokemon.name}</h1>
          <p className="text-sm text-slate-500">#{pokemon.id}</p>
        </div>

        {/* Favorite Button */}
        <div className="flex justify-center">
          <Button
            onClick={onToggleFavorite}
            variant={isFavorite ? "default" : "outline"}
            className="gap-2 px-6"
            size="lg"
          >
            <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Remove Favorite" : "Add to Favorites"}
          </Button>
        </div>

        {/* Type Chips */}
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Type</h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(type)}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Abilities */}
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Abilities</h2>
          <ul className="space-y-2">
            {pokemon.abilities.length > 0 ? (
              pokemon.abilities.map((ability) => (
                <li key={ability} className="capitalize text-slate-700 dark:text-slate-300">
                  • {ability}
                </li>
              ))
            ) : (
              <p className="text-slate-500">No known abilities</p>
            )}
          </ul>
        </div>

        {/* Evolution Chain */}
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Evolution Chain</h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.evolutionChain.length > 0 ? (
              pokemon.evolutionChain.map((evolution,index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 capitalize text-sm"
                >
                  {evolution.details}
                </span>
              ))
            ) : (
              <p className="text-slate-500">No evolution information</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "bg-slate-300 text-slate-900",
    fire: "bg-red-400 text-white",
    water: "bg-blue-400 text-white",
    electric: "bg-yellow-400 text-slate-900",
    grass: "bg-green-400 text-white",
    ice: "bg-cyan-400 text-white",
    fighting: "bg-red-700 text-white",
    poison: "bg-purple-500 text-white",
    ground: "bg-amber-600 text-white",
    flying: "bg-indigo-400 text-white",
    psychic: "bg-pink-500 text-white",
    bug: "bg-lime-500 text-slate-900",
    rock: "bg-slate-600 text-white",
    ghost: "bg-purple-700 text-white",
    dragon: "bg-indigo-600 text-white",
    dark: "bg-slate-800 text-white",
    steel: "bg-slate-400 text-slate-900",
    fairy: "bg-pink-400 text-white",
  }
  return colors[type] || "bg-slate-300 text-slate-900"
}
