import { Row } from '@past3lle/components'
import { ProductSubHeader } from 'pages/common/styleds'
import { ChangeEvent, useCallback } from 'react'
import { ChevronDown } from 'react-feather'
import { useGetShowcaseSettings, useUpdateShowcaseSettings } from 'state/user/hooks'
import { ShowcaseGender, ShowcaseHeight, UserState } from 'state/user/reducer'
import styled from 'styled-components/macro'

const ModelSizeSelectorWrapper = styled(Row)`
  position: relative;
  flex-flow: row wrap;
  width: 100%;
  gap: 0.7rem;
  margin-bottom: 0;
  justify-content: space-between;

  > div {
    position: relative;
    flex: 1 1 21.8rem;
    min-width: 15.5rem;

    > ${ProductSubHeader} {
      position: absolute;
      width: min-content;
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 1.2rem;
    }

    > ${Row} {
      height: 5rem;

      > select {
        color: ${({ theme }) => theme.content.text};
        border: 1px solid ${({ theme }) => theme.input.border.colour};
        border-radius: 1rem;
        font-size: 1.5rem;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0.8rem 0 0.8rem 0;
        padding-left: calc(50% - 1.6rem);
        font-weight: 700;
        outline: none;
        font-style: italic;

        &:hover {
          background: ${({ theme }) => theme.input.hoverColour};
        }

        transition: background 0.2s ease-in-out;
      }
      > svg {
        cursor: pointer;
        width: 2rem;
        height: 100%;
        margin-left: -3rem;
      }
    }
  }
`
const FEMALE_HEIGHT_LIST: ShowcaseHeight[] = [165, 175]
const MALE_HEIGHT_LIST: ShowcaseHeight[] = [175, 185]

const GENDER_HEIGHT_MAP = {
  FEMALE: new Set(FEMALE_HEIGHT_LIST),
  MALE: new Set(MALE_HEIGHT_LIST),
}

export default function useModelSizeSelector() {
  const { height: selectedHeight, gender: selectedGender } = useGetShowcaseSettings()
  const updateShowcaseSettings = useUpdateShowcaseSettings()

  const handleSelectGender = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault()
      const gender = e.target.value as ShowcaseGender
      const changingState: Partial<UserState['showcase']> = { gender }

      // height doesn't exist for selecte gender, set default
      if (!GENDER_HEIGHT_MAP[gender].has(selectedHeight)) {
        changingState.height = gender === 'FEMALE' ? FEMALE_HEIGHT_LIST[0] : MALE_HEIGHT_LIST[0]
      }

      updateShowcaseSettings(changingState)
    },
    [selectedHeight, updateShowcaseSettings]
  )

  const handleSelectHeight = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault()
      updateShowcaseSettings({ height: +e.target.value as ShowcaseHeight })
    },
    [updateShowcaseSettings]
  )

  const ModelSizeSelector = useCallback(
    () => (
      <ModelSizeSelectorWrapper>
        {/* GENDER SELECT */}
        <div>
          <ProductSubHeader margin="0" fontSize="1.2rem" fontWeight={500}>
            GENDER
          </ProductSubHeader>
          <Row>
            <select onChange={handleSelectGender} value={selectedGender}>
              {Object.keys(GENDER_HEIGHT_MAP).map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            <ChevronDown />
          </Row>
        </div>

        <div>
          <ProductSubHeader margin="0" fontSize="1.2rem" fontWeight={500}>
            HEIGHT
          </ProductSubHeader>
          <Row>
            <select onChange={handleSelectHeight} value={selectedHeight}>
              {Array.from(GENDER_HEIGHT_MAP[selectedGender]).map((height) => (
                <option key={height} value={height}>
                  {height}cm
                </option>
              ))}
            </select>
            <ChevronDown />
          </Row>
        </div>
      </ModelSizeSelectorWrapper>
    ),
    [handleSelectGender, handleSelectHeight, selectedGender, selectedHeight]
  )

  return {
    ModelSizeSelector,
    modelSize: selectedHeight,
    modelGender: selectedGender,
  }
}
