import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useSearchParamsStore(): [
  ReadonlyURLSearchParams | null,
  (key: string, value: string) => void,
] {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  const setSearchParams = useCallback(
    (key: string, value: string) => router.push(pathname + '?' + createQueryString(key, value)),
    [createQueryString, pathname, router],
  )

  return [searchParams, setSearchParams]
}
