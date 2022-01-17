const path = require('path');

module.exports = {
    parserOptions: {
        parser:              '@typescript-eslint/parser',
        sourceType:          'module',
        ecmaVersion:         2019,
        extraFileExtensions: ['.vue'],
        project:             path.join(__dirname, 'tsconfig.json'),
    },
};
