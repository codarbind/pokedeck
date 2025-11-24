"use client"

import { useEffect } from "react"
import { ChevronLeft, ChevronRight, Bookmark, X } from "lucide-react"
import Image from "next/image"
import { EvolutionTimeline } from "./evolution-timeline"
import { PokemonStats } from "./pokemon-stats"
import type { PokemonDetailResponseDto } from "@/lib/api-client"

interface PokemonDetailModalProps {
  pokemon: PokemonDetailResponseDto | null
  isFavorite: boolean
  onToggleFavorite: () => void
  onClose: () => void
  onNavigate: (direction: "next" | "prev") => void
  canNavigateNext: boolean
  canNavigatePrev: boolean
}

export function PokemonDetailModal({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onClose,
  onNavigate,
  canNavigateNext,
  canNavigatePrev,
}: PokemonDetailModalProps) {
  useEffect(() => {
    if (!pokemon) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && canNavigateNext) onNavigate("next")
      if (e.key === "ArrowLeft" && canNavigatePrev) onNavigate("prev")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pokemon, canNavigateNext, canNavigatePrev, onClose, onNavigate])

  if (!pokemon) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">

        <div
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between px-6">
            <h1 className="text-3xl font-bold text-white capitalize">{pokemon.name}</h1>

            <div className="flex gap-2">
              <button onClick={onToggleFavorite} className="p-2 hover:bg-white/20 rounded-lg transition">
                <Bookmark size={24} className={isFavorite ? "fill-white text-white" : "text-white"} />
              </button>

              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-center">
                <Image
                  src={pokemon.sprite || "/placeholder.svg?height=192&width=192&query=pokemon"}
                  alt={pokemon.name}
                  width={192}
                  height={192}
                  className="animate-in fade-in duration-500"
                />
              </div>

              <div className="text-center mb-6">
                <p className="text-slate-600 dark:text-slate-400">ID: #{pokemon.id.toString().padStart(3, "0")}</p>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              {/* <div className="flex gap-4 w-full">
                <button
                  onClick={() => onNavigate("prev")}
                  disabled={!canNavigatePrev}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <button
                  onClick={() => onNavigate("next")}
                  disabled={!canNavigateNext}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={20} />
                </button>
              </div> */}
            </div>

            <div className="space-y-6 overflow-y-auto max-h-96">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Stats</h2>
                <PokemonStats stats={pokemon.stats} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Abilities</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <span
                      key={ability}
                      className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-lg text-sm capitalize"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Evolution Timeline */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-8 py-8">
            <EvolutionTimeline chain={pokemon.evolutionChain} />
          </div>
        </div>
      </div>
    </>
  )
}
