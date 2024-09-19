const isDev = import.meta.env.NODE_ENV !== 'production'

module.exports = {
  styledComponents: {
    fileName: isDev,
    displayName: isDev
  }
}
