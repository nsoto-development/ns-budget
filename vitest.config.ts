import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve(root, 'src/lib')
		}
	},
	test: {
		include: ['lib/**/*.test.ts', 'src/lib/**/*.test.ts'],
		environment: 'node'
	}
});
