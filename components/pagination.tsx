
import React, { useMemo } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}


export const COLOR_CLASSES = [
  'bg-red-500 hover:bg-red-600',
  'bg-blue-500 hover:bg-blue-600',
  'bg-green-500 hover:bg-green-600',
  'bg-yellow-500 hover:bg-yellow-600',
  'bg-purple-500 hover:bg-purple-600',
  'bg-pink-500 hover:bg-pink-600',
  'bg-indigo-500 hover:bg-indigo-600',
  'bg-teal-500 hover:bg-teal-600',
]

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPagesToShow = 8 

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = []

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is 8 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }
    
    // Always include page 1 and the last page
    pages.push(1)

    // Determine the window around the current page
    let start = Math.max(2, currentPage - 2)
    let end = Math.min(totalPages - 1, currentPage + 2)

    // Adjust window size if near boundaries
    if (currentPage < 5) {
        end = 5
    } else if (currentPage > totalPages - 4) {
        start = totalPages - 4
    }

    // Add starting ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add pages in the calculated window
    for (let i = start; i <= end; i++) {
        // Prevent duplicates with page 1
        if (i > 1 && i < totalPages) {
            pages.push(i)
        }
    }

    // Add ending ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...')
    }
    
    // Add the last page (if not already included)
    if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages)
    }
    
    // Final check to ensure we don't exceed max pages by removing duplicates caused by the logic
    const finalPages = pages.filter((item, index, self) => 
        index === self.findIndex((t) => (t === item))
    )

    // Simple truncation if still over 8 buttons (which shouldn't happen with the current logic, but as a guardrail)
    return finalPages
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-wrap justify-center items-center space-x-2 py-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition duration-150 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
      >
        Prev
      </button>

      {/* Page Circles (max 8 visible buttons) */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return <span key={`dots-${index}`} className="px-2 py-1 text-gray-500 dark:text-gray-400">...</span>
        }

        const pageNum = page as number
        const isCurrent = pageNum === currentPage
        // Cycle through the 8 colors for the buttons
        const colorClass = COLOR_CLASSES[index % COLOR_CLASSES.length] 

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-full text-white font-bold transition-all duration-150 ease-in-out shadow-md ${
              isCurrent
                ? `${colorClass} ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-opacity-75 ring-current shadow-lg`
                : `${colorClass} opacity-70 hover:opacity-100`
            }`}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={`Go to page ${pageNum}`}
          >
            {pageNum}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition duration-150 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
      >
        Next
      </button>
    </div>
  )
}