import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    theme:{
      extend:{
        fontSize:{
          'course-details-heading-small':['26px', '36px'],
          'course-details-heading-large':['36px', '44px'],
          'home-heading-small' : ['36px', '44px'],
          'home-heading-large' : ['48px', '56px'],
          'default':['15px', '21px']
        },
        gridTempelateColumns:{
          'auto' : 'repeat(auto-fit, minmax(200px, 1fr))'
        },
        spacing:{
          'section-height' : '500px',
        },
        maxWidth: {
          'course-card' : '424px'
        },
        boxShadow:{
         'custom-card':'0px 4px 15px 2px rbga(0,0,0,0.1)'
        }
      },
    },
  },
]
