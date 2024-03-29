'use strict'

module.exports = {
    'extends': 'eslint:recommended',
    'env': { 'node': true, 'browser': true, 'es6': true, 'jest': true },
    'parserOptions': { 'ecmaVersion': 2018 },
    'rules': {
        'strict': ['error', 'global'],
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'semi': ['error', 'never'],
        'quotes': ['warn', 'single', { 'avoidEscape': true }],
        'no-console': 'warn',
        'require-jsdoc': 'off',
        'valid-jsdoc': 'warn',
        'no-unused-vars': 'warn',
        'no-trailing-spaces': 'error',
        'curly': 'error',
        'handle-callback-err': 'error',
        'eol-last': ['error', 'always'],
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        'space-in-parens': ['error', 'never'],
        'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'error',
        'no-tabs': 'error',
        'no-whitespace-before-property': 'error',
        'space-unary-ops': ['warn', {
            'overrides': {
                '!': true,
                '!!': true,
                '+': true,
                '-': true
            }
        }]
    }
}
