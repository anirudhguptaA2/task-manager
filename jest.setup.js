// Polyfill fetch for Jest (Node.js)
import fetch, { Response, Request, Headers } from 'node-fetch';
global.fetch = fetch;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
// Polyfill fetch, Response, Request, Headers for Jest
global.fetch = require('node-fetch');
global.Response = require('node-fetch').Response;
global.Request = require('node-fetch').Request;
global.Headers = require('node-fetch').Headers;

// Mock window.alert for jsdom
if (typeof window !== 'undefined') {
	window.alert = jest.fn();
}

// Mock Vue Router for Vue Test Utils
jest.mock('vue-router', () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		currentRoute: { value: { path: '/' } },
	}),
	useRoute: () => ({
		params: {},
		query: {},
		name: '',
		path: '/',
	}),
	RouterLink: {
		name: 'RouterLink',
		render: () => null,
	},
}));

// Stub <router-link> globally for Vue Test Utils
import { config } from '@vue/test-utils';
config.global.stubs = config.global.stubs || {};
config.global.stubs['router-link'] = true;

// Mock Firebase Analytics to silence warnings
jest.mock('firebase/analytics', () => ({
	getAnalytics: () => ({ logEvent: jest.fn() }),
	isSupported: () => Promise.resolve(false),
}));
