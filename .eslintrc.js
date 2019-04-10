module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    parser: '@typescript-eslint/parser',
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "react-app",
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ], 
    settings:{
      react: {
        version: 'detect', 
      },
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": ["error", 4, {SwitchCase: 1}],
        "prettier/prettier": ["error"],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],

        // project settings
        "spaced-comment": [
            "warn",
            "always"
        ],
        'object-curly-spacing': ["error", "always"],
        'import/no-extraneous-dependencies': 0,

        'no-underscore-dangle': [
            'error',
            {
                allow: [
                    '_id',
                    '_ensureIndex'
                ]
            }
        ],
        'object-shorthand': [
            'error',
            'always',
            {
                avoidQuotes: false
            }
        ],
        'camelcase': 0,

        'space-before-function-paren': 0,
        
        // for Meteor API's that rely on `this` context, e.g. Template.onCreated and publications
        'func-names': 0,
        'prefer-arrow-callback': 0,

        // custom rules
        'object-shorthand': 'off',
        'no-unused-vars': ['error', { 'args': 'none' }],
        'no-else-return': 'off',
        'meteor/audit-argument-checks': 'off',
        'no-console': 'off',
        'prefer-template': 'off',
        'prefer-destructuring': 'off',
        'max-len': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'class-methods-use-this': 'off',
        'react/require-default-props': 'off',
        'react/forbid-prop-types': 'off',
        'jsx-a11y/label-has-for': 'off',
        'react/prefer-stateless-function': 'off',
        'react/no-unescaped-entities': ['error', {'forbid': ['>', '}']}],
        'no-plusplus': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'no-script-url': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'no-alert': 'off',
        'no-case-declarations': 'off',
        'react/jsx-closing-tag-location': 'off',
        'radix': 'off',
        'jsx-a11y/anchor-has-content': 'off',
        'guard-for-in': 'off',
        'react/prop-types': ['warn', {'skipUndeclared': true}],
        'react/display-name': 'off',
        'no-multi-spaces': 'error',
        'react/jsx-curly-spacing': [2, 'never'],
        'react/jsx-equals-spacing': [2, 'never'],
        'jsx-a11y/anchor-is-valid': 0,
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': 'error',
        'padded-blocks': ["error", "never"],

        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-explicit-any': 0,
    }
};