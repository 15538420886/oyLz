const webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
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
		tbug: './docs/tbug/main/app',
		tcase: './docs/tcase/main/app'
    },
    
	node: {
		fs: 'empty'
	},
	
    output: {
		path: 'build',
        filename: '[name].js',
    },
    
    plugins: [
//		commonsPlugin,
    	new CopyWebpackPlugin([{ from: './docs/public/static', to: 'assets' }]),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"production"'
			}
		}),
		
	    new webpack.optimize.OccurenceOrderPlugin(),
	    new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('react_lz.css'), // ����css/less��ʱ�����õ�ExtractTextPlugin
		
	    new webpack.optimize.UglifyJsPlugin({
	    	minimize: true,
			compress: {
				warnings: false,
			},
			mangle: true
	    }),
	    
	    new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('./manifest.json'),
		}),
    ],
    
	module: {
	    loaders: [
	      {
	        test: /\.json$/,
	        loaders: [
	          'json-loader?cacheDirectory'
	        ]
	      },
	      {
	        test: /\.(js|jsx)$/,
	        exclude: /node_modules/,
	        loaders: [
	          'babel-loader?cacheDirectory'
	        ]
	      },
	      {
	        test: /\.css$/,
	        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
	      },
	      {
	      	test: /\.jpg$/,
	      	loader: "file-loader"
	      },
	      {
	      	test: /\.(png|woff|woff2|eot|ttf|svg)$/,
	      	loader: 'url-loader?limit=100000'
	      }
	   ]
	},
	
	resolve: {
	    extensions: ['', '.js', '.json'],
	    alias: {
	      'bootstrap-css': path.join(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css'),
	      'antd-css': path.join(__dirname,'node_modules/antd/dist/antd.css')
	    }
	},
	
};

