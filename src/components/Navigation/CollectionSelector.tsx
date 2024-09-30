import { Row } from '@past3lle/components'
import { WHITE } from '@past3lle/theme'
import { COLLECTION_PARAM_NAME } from '@/constants/navigation'
import { ProductSubHeader } from '@/components/pages-common/styleds'
import { useCallback } from 'react'
import { useCollection } from '@/state/collection/hooks'
import styled from 'styled-components'
import { useRouter } from 'next/router'

export const CollectionSelector = () => {
  const { current, collections } = useCollection()
  const { push: navigate } = useRouter()

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      const collection = collections[e.target.value as string]
      if (collection) {
        navigate(COLLECTION_PARAM_NAME + '/' + collection.id)
      }
    },
    [collections, navigate],
  )

  if (!collections || !current?.id || !collections?.[current.id]?.id) return null
  return (
    <ProductSubHeader color={WHITE} backgroundColor="#e53f78" margin="0 0 1rem 0" padding={0} borderRadius="0.15em">
      <Row flexDirection={'row-reverse'} flexWrap={'wrap'} justifyContent="center" style={{ gap: '0.5rem' }}>
        <div style={{ fontVariationSettings: '"wght" 500', fontSize: '1.2rem' }}>{COLLECTION_PARAM_NAME}</div>

        <SelectWrapper>
          <select value={collections[current.id].id} onChange={handleChange}>
            {Object.values(collections).map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.title?.toUpperCase() || 'N/A'}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </Row>
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
