var path = require("path");
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDebug = process.env.NODE_ENV === 'development';
//const isDebug = true;

module.exports = {
    cache: true,
    entry: './src/index.js',
    output: {
        filename: './app/app.js'
    },
    devtool: isDebug ? '#cheap-module-eval-source-map' : null,
    watch: isDebug,
	plugins: [
		new webpack.DefinePlugin({
		  'process.env.NODE_ENV': JSON.stringify( isDebug ? 'development' : 'production')
		}),
		new ExtractTextPlugin('./app/css/style.css'),
        new webpack.NoErrorsPlugin()
	],
    module: {
        loaders: [
            {
				test: /\.js$/,
                include: [
                    path.join(__dirname, "src")
                ],
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: [ 'es2015', 'stage-0', 'react' ],
					plugins: ['transform-react-constant-elements']
                }
            },
			{
				test: /\.scss$/,
				include: [
                    path.join(__dirname, 'src')
                ],
				loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'sass'])
			}
        ],
        noParse: /onsenui\/js\/onsenui.js/
    },
	devServer: {
		host: '127.0.0.1',
		port: 8080
	}
};

if(!isDebug) {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
            /*minimize: !isDebug, //todo потестить эти свойства
            debug: isDebug,
            sourceMap: isDebug,
            output: {
                comments: false
            },*/
            compressor: {
                warnings: false,
                dead_code: true,
                drop_console: true,
                drop_debugger: true
            }
        })
	);
}