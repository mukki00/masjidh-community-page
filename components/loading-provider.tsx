"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FullPageLoading } from '@/components/ui/spinner'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean, text?: string) => void
  loadingText: string
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const setLoading = (loading: boolean, text?: string) => {
    setIsLoading(loading)
    if (text) {
      setLoadingText(text)
    }
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingText }}>
      {children}
      {isLoading && <FullPageLoading text={loadingText} />}
    </LoadingContext.Provider>
  )
}