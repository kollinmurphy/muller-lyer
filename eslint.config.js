module.exports = {
  overrides: [
    {
      files: ['*.js', '*.ts'],
      extends: 'eslint-config-standard-with-typescript',
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        '@typescript-eslint/switch-exhaustiveness-check': 'error'
      }
    }
  ]
};
