var extractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: {
		classui: './ts/docs/index.tsx',
		css: './css.js'
	},
	
	output: {
		filename: 'bundle/[name].js',
		path: __dirname+""
	},
	
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.s?css$/,
				use: extractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			}
		]
	},
	plugins: [
		new extractTextPlugin({filename: "bundle/classui.css"})
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},

	mode: "development",
	devtool: 'source-map',
	
	devServer: {
		host: '0.0.0.0',
		port: "1234"
	}
};