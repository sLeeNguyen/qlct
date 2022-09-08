module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping. Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['import', 'prettier', 'react', '@typescript-eslint', '@emotion'],
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': ['error'],
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/no-unresolved': 'warn',
    'react/self-closing-comp': 'warn',
    'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
    'no-debugger': 'warn',
    // disabled as with the static export Image does not make to much sense
    '@next/next/no-img-element': 'off',
    //
    'react/no-unknown-property': ['error', { ignore: ['css'] }], // enable `css` for emotion
    '@emotion/pkg-renaming': 'error',
  },
  settings: {
    'import/ignore': ['node_modules'],
    'import/resolver': {
      alias: {
        map: [
          ['src', './src/'],
          ['public', './public/'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
