import { Row } from '@past3lle/components'
import { ProductSubHeader } from '@/components/PagesComponents/styleds'
import { ChangeEvent, useCallback } from 'react'
import { ChevronDown } from 'react-feather'
import { useGetShowcaseSettings, useUpdateShowcaseSettings } from '@/state/user/hooks'
import { ShowcaseGender, ShowcaseHeight, UserState } from '@/state/user/reducer'
import { ModelSizeSelectorWrapper } from './styled'

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
    [selectedHeight, updateShowcaseSettings],
  )

  const handleSelectHeight = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault()
      updateShowcaseSettings({ height: +e.target.value as ShowcaseHeight })
    },
    [updateShowcaseSettings],
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
    [handleSelectGender, handleSelectHeight, selectedGender, selectedHeight],
  )

  return {
    ModelSizeSelector,
    modelSize: selectedHeight,
    modelGender: selectedGender,
  }
}
