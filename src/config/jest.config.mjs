/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    rootDir: '../../',
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [], // Used to setup environment variables that will be used within most/all tests (location wrt to rootDir) - run before testEnvironment is setup
    setupFilesAfterEnv: ["./src/config/jest.setup.mjs"], // Used to setup imports that will be used within most/all tests (location wrt to rootDir) - run after testEnvironment is setup
    transform: {
        "^.+\\.m[t|j]sx?$": ['babel-jest', { configFile: './src/config/.babelrc' }], // Used to point to the .babelrc file within this config folder (location wrt to rootDir)
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules" // Required to transform the css files and prevent parsing errors when running our tests
    },
    testRegex: ["(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$", "(/__tests__/.*|(\\.|/)(test|spec))\\.mjs?$"], // Required to allow jest to parse tsx files
    moduleFileExtensions: ['ts', 'js', 'mjs', 'json', 'node', 'tsx', 'jsx'], // Required to allow jest to parse tsx files
    clearMocks: true, // To clear mock calls and instances between every test
    verbose: true, // To show a more detailed description of the tests
    collectCoverage: true, // To monitor the amount of code my tests cover
    transformIgnorePatterns: ['<rootDir>/node_modules/'], // To ignore the node_modules folder when running tests
    coveragePathIgnorePatterns: ["<rootDir>/test/test-utils.mjs"] // The test-utils.js file does not need to be tested, therefore we need no coverage for it, this keeps our coverage output clean.
};