/* eslint-disable */

const React = require('react')

module.exports = {
  Value: function (val) {
    this._value = val
  },
  timing: jest.fn(() => ({ start: jest.fn() })),
  spring: jest.fn(() => ({ start: jest.fn() })),
  decay: jest.fn(() => ({ start: jest.fn() })),
  add: jest.fn(),
  multiply: jest.fn(),
  event: jest.fn(),
  parallel: jest.fn(),
  sequence: jest.fn(),
  delay: jest.fn(),
  loop: jest.fn(),
  createAnimatedComponent: (Component) => {
    return React.forwardRef((props, ref) => {
      return React.createElement(Component, { ...props, ref })
    })
  },
  createAnimatedPropsHook: () => () => ({}),
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
    bezier: jest.fn(),
    in: jest.fn(),
    out: jest.fn(),
    inOut: jest.fn()
  }
}
