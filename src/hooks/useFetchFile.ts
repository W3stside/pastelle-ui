import useSWR from 'swr'

function getErrorMessage(filePath: string, res: Response): string {
  return `Error fetching file ${filePath} - status: ${res.statusText}`
}

export default function useFetchFile(filePath: string) {
  const {
    data: file,
    isValidating,
    error,
  } = useSWR(filePath, () =>
    fetch(filePath)
      .then(async (res) => {
        if (res.ok) {
          const fileContent = await res.text()
          return fileContent
        } else {
          throw getErrorMessage(filePath, res)
        }
      })
      .catch((error) => {
        throw error
      })
  )

  return { file, loading: isValidating, error }
}
