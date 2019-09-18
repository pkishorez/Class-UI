module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'react-app',
		'plugin:prettier/recommended',
	],
	plugins: ['@typescript-eslint', 'react'],
	rules: {
		indent: [true, 'tabs', 4],
		'array-type': [true, 'array'],
		'member-access': false,
		'no-unused-expression': false,
		'variable-name': false,
		'object-literal-sort-keys': false,
		'no-console': false,
		'no-empty-interface': false,
		'max-classes-per-file': false,
		'react-hooks-nesting': 'error',
	},
};
