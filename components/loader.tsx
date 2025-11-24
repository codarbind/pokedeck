import React from 'react'

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}