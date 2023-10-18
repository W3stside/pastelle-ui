import { Text, TextProps } from '@past3lle/components'

const FONT_SIZES = {
  size: '4.5rem',
  weight: 50,
}
export function SmartImgLoader({ label = 'LOADING . . .', ...styleProps }: TextProps & { label?: string }) {
  return (
    <Text.Italic
      fontSize={FONT_SIZES.size}
      fontWeight={FONT_SIZES.weight}
      fontVariationSettings={{
        wght: FONT_SIZES.weight,
      }}
      {...styleProps}
    >
      {label}
    </Text.Italic>
  )
}
