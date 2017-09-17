// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'comma-spacing': 0,
      'comma-style': 0,
      'semi': [2, 'always'],
      'semi-spacing': 0,
      'semi-style': 0,
      'indent': 0,
      'keyword-spacing': 0,
      'space-before-blocks': 0,
      'space-before-function-paren': 0,
      'space-in-parens': 0,
      'space-infix-ops': 0,
      'space-unary-ops': 0,
      'spaced-comment': 0,
      'no-ternary': 0,
      'no-plusplus': 0,
      'one-var': 0
  }
}
