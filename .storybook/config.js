import { configure } from '@storybook/react';
import './decorator';

// automatically import all files ending in *.stories.js
function loadStories() {
	let req = require.context('../ts', true, /.stories.(js|ts)x?$/);
	req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
