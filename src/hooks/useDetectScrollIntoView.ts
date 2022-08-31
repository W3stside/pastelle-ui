import { useState, useEffect } from 'react'
export type LoadInView = {
  container: Document | Element
  conditionalCheck?: boolean
}
export default function useDetectScrollIntoView(
  elem: HTMLElement | null | undefined,
  options: IntersectionObserverInit | undefined,
  defaultView: boolean
) {
  const [isInView, setIsInView] = useState(defaultView)

  useEffect(() => {
    if (!elem || isInView) return

    const observerCb: IntersectionObserverCallback = ([entry]: IntersectionObserverEntry[], observer) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(elem)
      }
    }
    const observer = new IntersectionObserver(observerCb, options)

    // start observation of elem
    observer.observe(elem)

    // disconnect observer and close
    return () => {
      observer.disconnect()
    }
  }, [elem, options, isInView])

  return isInView
}
