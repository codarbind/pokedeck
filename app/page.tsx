"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { PokemonList } from "@/components/pokemon-list"
import { PokemonDetails } from "@/components/pokemon-details"
import { pokemonApi, type PokemonDetailResponseDto, type PokemonResponseDto } from "@/lib/api-client"

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonResponseDto[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Load initial Pokemon list from backend
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await pokemonApi.getAllPokemon()
        setPokemonList(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load Pokémon. Retry?")
      } finally {
        setLoading(false)
      }
    }

    loadPokemon()
  }, [])

  // Load favorite IDs from backend
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await pokemonApi.getFavoriteIds()
        setFavorites(response.data)
      } catch (err) {
        console.error("Failed to load favorites:", err)
      }
    }

    loadFavorites()
  }, [])

  const handleToggleFavorite = async (id: number) => {
    try {
      if (favorites.includes(id)) {
        await pokemonApi.removeFavorite(id)
        setFavorites((prev) => prev.filter((f) => f !== id))
      } else {
        await pokemonApi.addFavorite(id)
        setFavorites((prev) => [...prev, id])
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
    }
  }

  const handleSelectPokemon = async (pokemon: PokemonResponseDto) => {
    try {
      const response = await pokemonApi.getPokemonById(pokemon.id)
      setSelectedPokemon(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Pokemon details")
    }
  }

  const filteredPokemon = pokemonList
    .filter((p) => !showFavoritesOnly || favorites.includes(p.id))
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={setShowFavoritesOnly}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <PokemonList
          pokemon={filteredPokemon}
          selectedPokemon={selectedPokemon}
          favorites={favorites}
          loading={loading}
          error={error}
          onSelectPokemon={handleSelectPokemon}
          onToggleFavorite={handleToggleFavorite}
        />

        <PokemonDetails
          pokemon={selectedPokemon}
          isFavorite={selectedPokemon ? favorites.includes(selectedPokemon.id) : false}
          onToggleFavorite={() => selectedPokemon && handleToggleFavorite(selectedPokemon.id)}
        />
      </div>
    </div>
  )
}
