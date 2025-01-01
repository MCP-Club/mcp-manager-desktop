module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    'react/prop-types': 'off', // Disable prop-types as we're using TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
  }
}
