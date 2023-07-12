module.exports = {
    root: true,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: ['jest'],
    extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
    env: {
      node: true,
      es6: true,
      jest: true,
    },
    rules: {
      'no-console': ['error', { allow: ['error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: 'Sequelize|models' }],
      'jest/no-done-callback': 'warn',
    },
  };