/* eslint-disable */

const React = require('react')

module.exports = (Component) => {
  return React.forwardRef((props, ref) => {
    return React.createElement(Component, { ...props, ref })
  })
}
