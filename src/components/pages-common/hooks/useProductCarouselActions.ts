import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useProductWebCarouselActions({ startIndex }: { startIndex: number }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const onChange = (index: number) => setCurrentIndex(index)

  const pathname = usePathname()

  // EFFECT: on product change, reset web carousel index to 0
  useEffect(() => {
    setCurrentIndex(startIndex)
    // Ignore startIndex as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return {
    currentIndex,
    setCurrentIndex,
    onChange,
  }
}
