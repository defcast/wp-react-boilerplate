const path = require( 'path' );
const webpack = require( 'webpack' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const config = require( './config.json' );

const webpackConfig = {
	entry: [
		'./src/index.js'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve( __dirname, 'dist' ),
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loaders: [ 'babel-loader' ]
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract( {
					use: 'css-loader'
				} )
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}
		]
	},
	// devtool: "eval-source-map",
	plugins: [
		new BrowserSyncPlugin( {
				proxy: config.proxyURL,
				files: [
					'**/*.php'
				],
				reloadDelay: 0
			}
		),
		new ExtractTextPlugin( 'style.bundle.css' )
	]
};

if ( process.env.NODE_ENV === 'production' ) {
	const buildFolder = path.resolve( __dirname, 'wp-react-boilerplate-built' );
	webpackConfig.plugins.push( new webpack.optimize.UglifyJsPlugin( {
		'mangle': {
			'screw_ie8': true
		},
		'compress': {
			'screw_ie8': true,
			'warnings': false
		},
		'sourceMap': false
	} ) );

	webpackConfig.plugins.push(
		new CleanWebpackPlugin( [ buildFolder ] )
	);

	webpackConfig.plugins.push(
		new CopyWebpackPlugin( [
			{ from: path.resolve( __dirname, 'server' ) + '/**', to: buildFolder },
			{ from: path.resolve( __dirname, '*.php' ), to: buildFolder }
		], {

			// By default, we only copy modified files during
			// a watch or webpack-dev-server build. Setting this
			// to `true` copies all files.
			copyUnmodified: true
		} )
	);

	webpackConfig.output.path = buildFolder + '/dist';
}

module.exports = webpackConfig;