"use client"

import { Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  showFavoritesOnly: boolean
  onToggleFavorites: (show: boolean) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function Header({ showFavoritesOnly, onToggleFavorites, searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-20 flex items-center px-6 justify-between">
      <div className="text-2xl font-bold text-red-600">
        Poké<span className="text-blue-600">Deck</span>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        onClick={() => onToggleFavorites(!showFavoritesOnly)}
        className="gap-2"
      >
        <Star className="w-4 h-4" fill={showFavoritesOnly ? "currentColor" : "none"} />
        Favorites Only
      </Button>
    </header>
  )
}
