import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useProductWebCarouselActions({ startIndex }: { startIndex: number }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const onChange = (index: number) => setCurrentIndex(index)

  const location = useLocation()

  // EFFECT: on product change, reset web carousel index to 0
  useEffect(() => {
    setCurrentIndex(startIndex)
    // Ignore startIndex as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  return {
    currentIndex,
    setCurrentIndex,
    onChange,
  }
}
