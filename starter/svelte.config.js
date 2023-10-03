import { preprocessMeltUI } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sequence([
		vitePreprocess({}),
		preprocessMeltUI()
	]),

	kit: {
		adapter: adapter(),
		alias: {
			$styles: 'src/styles',
		}
	}
};

export default config;
