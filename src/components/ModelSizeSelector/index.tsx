import { ChangeEvent, useCallback, useState } from 'react'
import styled from 'styled-components/macro'
import { Row } from 'components/Layout'
import { ItemSubHeader } from 'pages/SingleItem/styleds'

const ModelSizeSelectorWrapper = styled(Row)`
  position: relative;
  flex-flow: row wrap;
  width: 100%;
  gap: 0 0.7rem;
  margin-bottom: 0;
  justify-content: space-between;

  > div {
    flex: 1 1 48%;
    > ${ItemSubHeader} {
      position: absolute;
      padding-left: 1.5rem;
      width: min-content;
    }
    > select {
      font-size: 1.5rem;
      min-height: 3rem;
      margin: 0;
      padding: 0.8rem 0 0.8rem 4rem;
      font-weight: 700;
      outline: none;
      font-style: italic;

      &:hover {
        background: ${({ theme }) => theme.green2};
      }

      transition: background 0.2s ease-in-out;
    }
  }
`
const GENDER_HEIGHT_MAP = {
  FEMALE: [165, 175],
  MALE: [175, 185]
}
type ShowcaseGender = 'MALE' | 'FEMALE'
type ShowcaseHeight = 165 | 175 | 185 | 190
export default function useModelSizeSelector() {
  const [selectedGender, setSelectedGender] = useState<ShowcaseGender>('MALE')
  const [selectedSize, setSelectedSize] = useState<ShowcaseHeight>(175)

  const handleSelectGender = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setSelectedGender(e.target.value as ShowcaseGender)
  }

  const ModelSizeSelector = useCallback(
    () => (
      <ModelSizeSelectorWrapper>
        {/* GENDER SELECT */}
        <div>
          <ItemSubHeader margin="0" fontSize="1.5rem" fontWeight={300}>
            GENDER
          </ItemSubHeader>
          <select onChange={handleSelectGender}>
            {Object.keys(GENDER_HEIGHT_MAP).map(gender => (
              <option key={gender} value={gender} selected>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div>
          <ItemSubHeader margin="0" fontSize="1.5rem" fontWeight={300}>
            HEIGHT
          </ItemSubHeader>
          <select>
            {GENDER_HEIGHT_MAP[selectedGender].map(size => (
              <option
                key={size}
                value={size}
                defaultValue={selectedSize}
                onSelect={() => setSelectedSize(size as ShowcaseHeight)}
              >
                {size}cm
              </option>
            ))}
          </select>
        </div>
      </ModelSizeSelectorWrapper>
    ),
    [selectedGender, selectedSize]
  )

  return {
    ModelSizeSelector,
    modelSize: selectedSize,
    modelGender: selectedGender
  }
}
