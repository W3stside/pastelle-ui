import { Column } from '@past3lle/components'
import { WHITE } from '@past3lle/theme'
import { COLLECTION_PARAM_NAME } from 'constants/navigation'
import { ProductSubHeader } from 'pages/common/styleds'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCollection } from 'state/collection/hooks'
import styled from 'styled-components/macro'

export const CollectionSelector = () => {
  const { current, collections } = useCollection()
  const navigate = useNavigate()

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      const collection = collections[e.target.value as string]
      if (collection) {
        navigate(COLLECTION_PARAM_NAME + '/' + collection.id)
      }
    },
    [collections, navigate]
  )

  if (!collections || !current?.id) return null

  return (
    <ProductSubHeader color={WHITE} margin="0 0 1rem 0" padding={0}>
      <Column justifyContent="center" style={{ gap: '0.5rem' }}>
        <h1 style={{ fontVariationSettings: '"wght" 300', fontSize: '1.2rem', marginBottom: 0 }}>
          {COLLECTION_PARAM_NAME}
        </h1>

        <SelectWrapper>
          <select value={collections[current.id].id} onChange={handleChange}>
            {Object.values(collections).map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.title?.toUpperCase() || 'N/A'}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </Column>
    </ProductSubHeader>
  )
}
const SelectWrapper = styled.div`
  font-size: 1.7rem;
  > * {
    color: ${({ theme }) => theme.offwhite};
  }

  select {
    // A reset of styles, including removing the default dropdown arrow
    appearance: none;
    // Additional resets for further consistency
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
    outline: none;
    cursor: pointer;
  }
`
