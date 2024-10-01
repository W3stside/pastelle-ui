import { Column, SpinnerCircle, Text } from '@past3lle/components'
import { NavigationStepsWrapper, InnerNavWrapper } from './styled'

export function NavigationFallback({ isSmallNav, isNavOpen }: { isSmallNav: boolean; isNavOpen: boolean }) {
  return (
    <NavigationStepsWrapper
      isOpen={isNavOpen}
      minWidth="9vw"
      width="16.5rem"
      currentMedia={{ fallbackColor: 'linear-gradient(1deg, rgb(0 0 0 / 92%) 90%, rgb(0 0 0 / 83%) 20%)' }}
    >
      {/* <NavLogo parentNode={parentNode} logoSrcSet={currentProduct?.navLogo} /> */}
      <InnerNavWrapper $width="100%" height={'100%'}>
        <Column height="100%" justifyContent={'center'} alignItems={'center'} gap="1rem">
          <SpinnerCircle size={70} />
          {isSmallNav && <Text.LargeHeader fontWeight={100}>LOADING NAV. . .</Text.LargeHeader>}
        </Column>
      </InnerNavWrapper>
    </NavigationStepsWrapper>
  )
}
