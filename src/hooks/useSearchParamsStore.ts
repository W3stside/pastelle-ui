import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

type NavigateUrlAs = Parameters<ReturnType<typeof useRouter>['replace']>[1]
type NavigateOptions = Parameters<ReturnType<typeof useRouter>['replace']>[2]
export function useSearchParamsStore(): [
  ReadonlyURLSearchParams | null,
  (key: string, value: string, url?: NavigateUrlAs, options?: NavigateOptions) => void,
  (key: string, options?: NavigateOptions) => void
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
    [searchParams]
  )

  const setSearchParams = useCallback(
    (key: string, value: string, url?: NavigateUrlAs, options?: NavigateOptions) =>
      router.replace({ pathname, query: createQueryString(key, value) }, url, options),
    [createQueryString, pathname, router]
  )

  const removeSearchParams = useCallback(
    (key: string, options?: NavigateOptions) => {
      const params = new URLSearchParams(searchParams)
      params.delete(key)
      router.replace({ pathname, query: params.toString() }, undefined, options)
    },
    [pathname, router, searchParams]
  )

  return [searchParams, setSearchParams, removeSearchParams]
}
