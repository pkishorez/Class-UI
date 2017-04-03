module.exports = {
	entry: './index.tsx',
	
	output: {
		filename: 'classui.js',
		path: __dirname+"/bundle"
	},
	
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				enforce: 'pre',
				test: /\.tsx?$/,
				use: "source-map-loader"
			}
		],
		loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ""]
	},

	devtool: 'inline-source-map',
	
	devServer: {
		port: 8080
	}
};