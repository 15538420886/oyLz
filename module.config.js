var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
};

