"use client"

import { useEffect, useState } from "react"
import { EvolutionChainResponseDto, EvolutionStageDto, pokemonApi, type EvolutionStepDto } from "@/lib/api-client"
import Image from "next/image"

interface EvolutionTimelineProps {
  pokemonId: number
}

export function EvolutionTimeline({ chain }: EvolutionChainResponseDto) {
  const [evolution, setEvolution] = useState<EvolutionStageDto[]>([])
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvolution = async () => {
      try {
        setLoading(true)
        //const data = await pokemonApi.getEvolutionChain(pokemonId)
        setEvolution(chain)
      } catch (err) {
        console.error("Failed to load evolution chain:", err)
      } finally {
        setLoading(false)
      }
    }

    loadEvolution()
  }, [chain])

  if (loading || evolution.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Evolution Chain</h2>

      <div className="flex flex-col space-y-4">
        {evolution.map((step, index) => (
          <div key={index} className="flex gap-4 items-start">
            {/* Dot and connector */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              {index < evolution.length - 1 && (
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-indigo-600 my-1" />
              )}
            </div>

            {/* Card */}
            <button
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              className="flex-1 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src={step.sprite || "/placeholder.svg?height=64&width=64&query=pokemon"}
                    alt={step.name}
                    width={64}
                    height={64}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white capitalize">{step.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.trigger}</p>
                </div>

                <span className="text-2xl text-slate-400 dark:text-slate-500">
                  {expandedStep === index ? "−" : "+"}
                </span>
              </div>

              {expandedStep === index && (
                <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Types</p>
                    <div className="flex flex-wrap gap-2">
                      {step.types.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {step.requirements && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Requirements:</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{step.requirements}</p>
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
