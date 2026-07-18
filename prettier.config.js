/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{ files: 'lib/**/*.ts', options: { useTabs: false, tabWidth: 2 } }
	]
};

export default config;
