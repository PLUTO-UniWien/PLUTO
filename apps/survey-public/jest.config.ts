module.exports = {
  displayName: 'survey-public',
  preset: '../../jest.preset.js',
  transform: {
    '^.+.vue$': '@vue/vue2-jest',
    '.+.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'vue', 'js', 'json'],
  coverageDirectory: '../../coverage/apps/survey-public',
  snapshotSerializers: ['jest-serializer-vue'],
  globals: {
    'ts-jest': {
      tsconfig: 'apps/survey-public/tsconfig.spec.json',
      babelConfig: 'apps/survey-public/babel.config.js',
    },
    'vue-jest': {
      tsConfig: 'apps/survey-public/tsconfig.spec.json',
      babelConfig: 'apps/survey-public/babel.config.js',
    },
  },
};
