/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
	// Allow CORS for API routes
	source: '/api/:path*',
	headers: [
		{ key: 'Access-Control-Allow-Credentials', value: 'true' },
		{ key: 'Access-Control-Allow-Origin', value: '*' },
		{
			key: 'Access-Control-Allow-Methods',
			value: 'GET,DELETE,PATCH,POST,PUT'
		},
		{
			key: 'Access-Control-Allow-Headers',
			value:
				'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
		}
	]
};

export default config;
