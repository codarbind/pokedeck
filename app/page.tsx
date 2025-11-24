"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { PokemonGrid } from "@/components/pokemon-grid"
import { PokemonDetailModal } from "@/components/pokemon-detail-modal"
import { Header } from "@/components/header"
import { pokemonApi, type PokemonDetailResponseDto, type PokemonResponseDto } from "@/lib/api-client"


const ITEMS_PER_PAGE = 20

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonResponseDto[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingPokemonId, setLoadingPokemonId] = useState<number | null>(null)

  // state for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(150)

  // Function to load Pokemon data for a specific page
  const loadPokemon = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      // API call with the current page and items per page
      const data = await pokemonApi.getAllPokemon(page, ITEMS_PER_PAGE)
      setPokemonList(data.data)
      setTotalCount(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Pokémon. Retry?")
    } finally {
      setLoading(false)
    }
  }, [])

  // load Pokemon on initial mount and when currentPage changes
  useEffect(() => {
    // Only load if not searching or filtering by favorites
    if (!searchTerm && !showFavoritesOnly) {
      loadPokemon(currentPage)
    }
  }, [currentPage, loadPokemon, searchTerm, showFavoritesOnly])

  // Effect to load favorites
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

  const handleSelectPokemon = useCallback(async (pokemon: PokemonResponseDto) => {
    try {
      setLoadingPokemonId(pokemon.id)
      const response = await pokemonApi.getPokemonById(pokemon.id)
      setSelectedPokemon(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Pokemon details")
    } finally {
      setLoadingPokemonId(null)        // stop loader when done
    }
  }, [])

  const handleNavigatePokemon = useCallback(
    (direction: "next" | "prev") => {
      if (!selectedPokemon) return
      const currentIndex = pokemonList.findIndex((p) => p.id === selectedPokemon.id)
      if (currentIndex === -1) return

      const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
      if (nextIndex >= 0 && nextIndex < pokemonList.length) {
        handleSelectPokemon(pokemonList[nextIndex])
      }
    },
    [selectedPokemon, pokemonList, handleSelectPokemon],
  )

  // Filtered list only applies to the currently loaded page
  // if client-side filtering is active
  const filteredPokemon = useMemo(() => {
    let filtered = pokemonList;

    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => favorites.includes(p.id));
    }

    if (searchTerm) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return filtered;
  }, [pokemonList, showFavoritesOnly, favorites, searchTerm]);

  // Calculate total pages for pagination component
  const totalPages = useMemo(() => Math.ceil(totalCount / ITEMS_PER_PAGE), [totalCount])


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={setShowFavoritesOnly}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <PokemonGrid
        pokemon={filteredPokemon}
        favorites={favorites}
        loading={loading}
        error={error}
        onSelectPokemon={handleSelectPokemon}
        onToggleFavorite={handleToggleFavorite}
        currentPage={currentPage}
        totalPages={searchTerm || showFavoritesOnly ? 1 : totalPages}
        onPageChange={setCurrentPage}
        loadingPokemonId={loadingPokemonId}
      />

      <PokemonDetailModal
        pokemon={selectedPokemon}
        isFavorite={selectedPokemon ? favorites.includes(selectedPokemon.id) : false}
        onToggleFavorite={() => selectedPokemon && handleToggleFavorite(selectedPokemon.id)}
        onClose={() => setSelectedPokemon(null)}
        onNavigate={handleNavigatePokemon}
        canNavigateNext={
          selectedPokemon ? pokemonList.findIndex((p) => p.id === selectedPokemon.id) < pokemonList.length - 1 : false
        }
        canNavigatePrev={selectedPokemon ? pokemonList.findIndex((p) => p.id === selectedPokemon.id) > 0 : false}
      />
    </main>
  )
}