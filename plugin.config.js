var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
var env = process.env.WEBPACK_BUILD || 'development';
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

var paths = [
  '/'
];

module.exports = [
//	commonsPlugin,
//    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([{ from: './docs/public/static', to: 'assets' }]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
//    new StaticSiteGeneratorPlugin('main', paths, {}),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("/assets/style.css"),
	
	/*new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		compress: {
			warnings: false,
		},
		mangle: true
	}),*/
    
    new webpack.DllReferencePlugin({
      context: __dirname, // ָ��һ��·����Ϊ�����Ļ�������Ҫ��DllPlugin��context�����һ�£�����ͳһ����Ϊ��Ŀ��Ŀ¼
      manifest: require('./manifest.json'), // ָ��manifest.json
   }),
];
