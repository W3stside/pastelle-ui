import { ReactNode } from 'react'
import { ItemSubHeader } from 'pages/SingleItem/styleds'
import styled from 'styled-components/macro'
import { rotateKeyframe } from 'theme/styles/animations'
import { setCssBackground } from 'theme/utils'
import { GenericImageSrcSet } from 'components/Carousel'
import { portugalBg } from 'components/Layout/Article'
import { ColumnCenter } from 'components/Layout'
import PastelleCursiveLoader from './PastelleCursiveLoader'

export const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotateKeyframe} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.primary1};
  }
`

type StyleParams = {
  top?: string
  right?: string
  bottom?: string
  left?: string
  width?: string
  showBg?: boolean
}

const moddedPtBgUrl = portugalBg + 'q-2,w-10,h-10,bl-10,'
export const AnimatedContainer = styled(ColumnCenter).attrs(props => ({
  ...props,
  height: '100%',
  justifyContent: 'center'
}))<{ showBg?: boolean }>`
  ${({ theme, showBg = true }) =>
    showBg &&
    setCssBackground(theme, {
      imageUrls: [
        { defaultUrl: moddedPtBgUrl } as GenericImageSrcSet,
        { defaultUrl: moddedPtBgUrl } as GenericImageSrcSet,
        { defaultUrl: moddedPtBgUrl + 'w-1,h-1' } as GenericImageSrcSet
      ],
      backgroundAttributes: ['center/contain repeat', '-1px -1px/contain repeat'],
      backgroundBlendMode: 'color-burn',
      backgroundColor: '#e6e6e61c',
      skipIk: true
    })}

  filter: contrast(2.5);

  > * {
    width: 60%;
    margin: auto;
  }
`
const FixedContainer = styled(AnimatedContainer)<StyleParams>`
  position: fixed;
  top: ${({ top = '25%' }) => top};
  bottom: ${({ bottom = '25%' }) => bottom};
  left: ${({ left = '25%' }) => left};
  right: ${({ right = '25%' }) => right};
  width: ${({ width = 'auto' }) => width};

  ${({ showBg = true }) => !showBg && `background: unset;`}

  z-index: 0;

  > * {
    z-index: 1;
  }
`

interface LoadingParams {
  loadingLabel?: string
  loadingComponent: ReactNode
}

export const FixedAnimatedLoader = ({
  loadingComponent,
  loadingLabel,
  ...styleParams
}: LoadingParams & StyleParams) => (
  <FixedContainer {...styleParams}>
    <ItemSubHeader>
      {loadingComponent}
      <strong>{loadingLabel}</strong>
    </ItemSubHeader>
  </FixedContainer>
)

const topLevelLoaderProps = {
  top: '0',
  left: '0',
  right: '0',
  bottom: '0'
}
export const FallbackLoader = () => (
  <FixedAnimatedLoader loadingComponent={<PastelleCursiveLoader />} {...topLevelLoaderProps} />
)

export const AnimatedLoader = ({ loadingComponent, loadingLabel }: LoadingParams) => (
  <AnimatedContainer>
    {loadingComponent}
    {loadingLabel && <strong>{loadingLabel}</strong>}
  </AnimatedContainer>
)

export const AnimatedPastelleLoader = () => <AnimatedLoader loadingComponent={<PastelleCursiveLoader />} />

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({
  size = '16px',
  stroke,
  ...rest
}: {
  size?: string
  stroke?: string
  [k: string]: any
}) {
  return (
    <StyledSVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" size={size} stroke={stroke} {...rest}>
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSVG>
  )
}
