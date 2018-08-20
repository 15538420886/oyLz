var path = require('path');
var webpack = require('webpack');
var env = process.env.WEBPACK_BUILD || 'development';
var nginx = "http://10.10.10.201:8082";
//var nginx = "http://127.0.0.1:10800";
var nginx2 = 'http://124.202.135.197:18580';
var nginx3 = "http://127.0.0.1:10800";

var config = [{
	devtool: 'source-map',
	devServer: {
		contentBase: './build',
		historyApiFallback: true,
		stats: {
			chunks: false
		},
		proxy: {
			"/auth_s": {
				target: nginx,
				changeOrigin: true
			},
			"/camp_s": {
				target: nginx,
				changeOrigin: true
			},
			"/resume2_s": {
				target: nginx,
				changeOrigin: true
			},
			"/param_s": {
				target: nginx,
				changeOrigin: true
			},
			"/dev_s": {
				target: nginx,
				changeOrigin: true
			},
			"/hr_s": {
				target: nginx,
				changeOrigin: true
			},
			"/proj_s": {
				target: nginx,
				changeOrigin: true
			},
			"/cost_s": {
				target: nginx,
				changeOrigin: true
			},
			"/flow_s": {
				target: nginx,
				changeOrigin: true
			},
			"/ats_s": {
				target: nginx,
				changeOrigin: true
			},
			"/asset_s": {
				target: nginx,
				changeOrigin: true
			},
			"/tbug_s": {
				target: nginx,
				changeOrigin: true
			},
			"/tcase_s": {
				target: nginx,
				changeOrigin: true
			},
		},
	},
	entry: {
		main: './docs/lib/app',
		resume: './docs/resume/main/app',
		auth: './docs/auth/main/app',
		hr: './docs/hr/main/app',
		proj: './docs/proj/main/app',
		avt: './docs/avt/main/app',
		uman: './docs/auth/umain/app',
		camp: './docs/camp/main/app',
		env: './docs/env/main/app',
		dev: './docs/dev/main/app',
		cost: './docs/cost/main/app',
		ats: './docs/ats/main/app',
		asset: './docs/asset/main/app',
		tbug:'./docs/tbug/main/app',
		tcase:'./docs/tcase/main/app'
	},
	node: {
		fs: 'empty'
	},
	output: {
		path: './build',
		filename: '[name].js',
	},

	plugins: require('./plugin.config.js'),
	module: require('./module.config.js'),
	resolve: require('./resolve.config.js')
}];

module.exports = config;

