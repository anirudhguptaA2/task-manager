// Polyfill fetch for Jest (Node.js)
const fetch = require('node-fetch');
global.fetch = fetch;
global.Response = fetch.Response;
global.Request = fetch.Request;
global.Headers = fetch.Headers;
