"use client"

import Image from "next/image"
import { Bookmark } from "lucide-react"
import type { PokemonResponseDto } from "@/lib/api-client"

interface PokemonCardProps {
  pokemon: PokemonResponseDto
  isFavorite: boolean
  onSelect: (pokemon: PokemonResponseDto) => void
  onToggleFavorite: (id: number) => void
  isLoading: boolean
}

export function PokemonCard({ pokemon, isFavorite, onSelect, onToggleFavorite, isLoading }: PokemonCardProps) {
  if(isLoading) console.log({isLoading})
    return (
    <div
      onClick={() => onSelect(pokemon)}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 aspect-square"
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
        <div className={`relative w-24 h-24 mb-2 ${  isLoading ? "animate-pulse-scale" : "group-hover:scale-110"} transition-transform duration-300`}>
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` || "/placeholder.svg?height=96&width=96&query=pokemon"}
            alt={pokemon.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-white text-center capitalize truncate w-full group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {pokemon.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">#{pokemon.id.toString().padStart(3, "0")}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(pokemon.id)
        }}
        className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-blue-900 transition opacity-0 group-hover:opacity-100"
      >
        <Bookmark size={16} className={`${isFavorite ? "fill-blue-500 text-blue-500" : "text-slate-400"}`} />
      </button>
    </div>
  )
}
