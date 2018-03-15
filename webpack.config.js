module.exports = {
	entry: {
		bundle: './ts/docs/index.tsx'
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
			}
		]
	},
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