import { RobotoVariableFontProvider, StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import CartUpdater from '@/state/cart/updater'
// import CollectionUpdater from '@/state/collection/updater'
import { CustomStaticGlobalCSSProvider, CustomThemedGlobalCSSProvider } from '@/theme/global'

export function PastelleStoreUpdaters() {
  return (
    <>
      <CartUpdater />
      {/* <CollectionUpdater /> */}
    </>
  )
}

export function StaticCSSProviders() {
  return (
    <>
      <RobotoVariableFontProvider />
      <StaticGlobalCssProvider />
      <CustomStaticGlobalCSSProvider />
    </>
  )
}

export function ThemedCSSProviders() {
  return (
    <>
      <ThemedGlobalCssProvider />
      <CustomThemedGlobalCSSProvider />
    </>
  )
}
