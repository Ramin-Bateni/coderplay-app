module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-mixed-spaces-and-tabs": 0,
    //"quotes": ["error", "double"]
    'quotes': "off",
    'typedef':0,
    "comment-format":0,
    "missing semicolon":false,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
