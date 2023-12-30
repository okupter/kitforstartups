import { preprocessMeltUI } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
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
