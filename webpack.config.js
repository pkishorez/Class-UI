module.exports = {
	entry: './index.tsx',
	
	output: {
		filename: 'classui.js',
		path: __dirname+"/bundle"
	},
	
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.tsx?$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				loader: 'source-map-loader'
			}
		]
	},
	resolve: {
		alias: {
			'classui': './ts/Components'
		},
		extensions: [".tsx", ".ts", ".js"]
	},

	devtool: 'inline-source-map',
	
	devServer: {
		host: '0.0.0.0',
		port: 8080
	}
};