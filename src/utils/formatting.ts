import { CurrencyCode } from 'shopify/graphql/types'

/**
 * @name formatCurrency
 * @param amount number amount to format e.g 1234
 * @param options @type { Intl.NumberFormat } - defaults to { currency: 'pt-PT' }
 * @returns
 */
export function formatShopifyCurrency(
  amount: number,
  options: { locales: string | string[]; currency: CurrencyCode } = {
    locales: 'pt-PT',
    currency: CurrencyCode.Eur,
  }
) {
  return new Intl.NumberFormat(options.locales, {
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    ...options,
    style: 'currency',
  }).format(amount)
}
