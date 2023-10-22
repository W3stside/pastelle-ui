/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const dotEnv = require('dotenv')
const webpack = require('webpack')
const { override } = require('customize-cra')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

dotEnv.config()

function addWebpackOverride(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    https: require.resolve('https-browserify'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    zlib: require.resolve('browserify-zlib'),
  })
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ])
  // Analyze bundle size and show UI
  if (process.env.ANALYZE_BUNDLE == 'true') config.plugins.concat(new BundleAnalyzerPlugin())

  config.ignoreWarnings = [/Failed to parse source map/]
  config.module.rules.push({
    test: /\.(ts|tsx|js|mjs|jsx)$/,
    enforce: 'pre',
    loader: require.resolve('source-map-loader'),
    resolve: {
      fullySpecified: false,
    },
  })

  return config
}

module.exports = {
  babel: {
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
  },
  webpack: override(addWebpackOverride),
}
