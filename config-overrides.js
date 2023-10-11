/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const webpack = require('webpack')
const { override } = require('customize-cra')
const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

const cspConfigPolicy = {
  'default-src': "'none'",
  'media-src': ['https://cdn.shopify.com', 'https://ik.imagekit.io/pastelle/'],
  'img-src': [
    "'self'",
    'https://ik.imagekit.io/pastelle/',
    'https://cdn.shopify.com',
    'https://cryptologos.cc/logos/versions/ethereum-eth-logo-colored.svg',
    'https://images.web3auth.io',
    'https://web3auth.io/images/',
    'https://user-images.githubusercontent.com',
    'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/',
    'https://explorer-api.walletconnect.com',
    'data:',
  ],
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': [
    "'self'",
    // google tag
    "'sha256-jwsanj4WKKtrMM+7Khy+zjXFPYb+YaRZ/mLaS40iTgE='",
  ],
  'script-src-elem': [
    "'self'",
    'https://www.googletagmanager.com',
    // google tag
    "'sha256-jwsanj4WKKtrMM+7Khy+zjXFPYb+YaRZ/mLaS40iTgE='",
  ],
  'connect-src': [
    "'self'",
    'https://*.google-analytics.com',
    // ipfs
    'https://pastelle.infura-ipfs.io',
    'https://ipfs.io/ipfs/',
    // w3a
    'wss://broadcast-server.tor.us',
    'https://broadcast-server.tor.us',
    'https://admin.openlogin.com/api/',
    // wc
    'https://explorer-api.walletconnect.com',
    'wss://relay.walletconnect.com',
    'https://rpc.walletconnect.com',
    'https://e3f9fe-2.myshopify.com',
    'https://rpc.ankr.com',
    'https://pstlcollections.s3.eu-south-2.amazonaws.com',
  ],
  'manifest-src': "'self'",
  'frame-src': ['https://verify.walletconnect.com', 'https://verify.walletconnect.org'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
}

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

function addCspHtmlWebpackPlugin(config) {
  if (process.env.NODE_ENV !== 'production') {
    config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy))
  }

  return config
}

module.exports = {
  babel: {
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
  },
  webpack: override(addWebpackOverride, addCspHtmlWebpackPlugin),
}
