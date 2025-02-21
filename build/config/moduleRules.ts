import type { PathData, RuleSetRule } from "webpack";
import type { Environment } from "../environment.js";

export function moduleRules(environment: Environment): RuleSetRule[] {
	return [
		// Fix for weird issue where a Node polyfill can't be resolved from an ESM module
		{
			test: /\.m?js$/i,
			resolve: {
				fullySpecified: false,
			},
		},

		// Compile TypeScript files
		{
			exclude: /node_modules/i,
			test: /\.tsx?$/i,
			use: [
				// Transpile TypeScript source into browser-compatible JS using SWC
				{
					loader: "swc-loader",
					options: {
						sourceMaps: environment.useSourceMaps,
					},
				},
			],
		},

		// Compile SCSS files into CSS resource assets
		{
			test: /\.scss$/i,
			type: "asset/resource",
			generator: {
				filename(pathInfo: PathData) {
					const match = pathInfo.filename.match(/^src\/styles\/(.*)\.scss$/i);

					if (!match) {
						return pathInfo.filename;
					}

					return `css/${match[1]}.css`;
				},
			},
			use: [
				{
					loader: "sass-loader",
					options: {
						sourceMap: environment.useSourceMaps,
						sassOptions: {
							sourceMapIncludeSources: true,
							outputStyle: environment.prod ? "compressed" : "expanded",
							quietDeps: true,
						},
					},
				},
			],
		},

		// Handle direct CSS file imports with style-loader/css-loader
		{
			test: /\.css$/i,
			use: ["style-loader", "css-loader"],
		},
	];
}
