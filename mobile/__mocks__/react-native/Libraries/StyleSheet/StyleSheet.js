module.exports = {
  create: (styles) => styles,
  flatten: (style) => {
    if (Array.isArray(style)) {
      return style.reduce((flattened, s) => {
        if (s) {
          return { ...flattened, ...module.exports.flatten(s) }
        }
        return flattened
      }, {})
    }
    return style || {}
  },
  hairlineWidth: 1,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }
}
