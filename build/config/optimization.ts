import type { Configuration, Module, WebpackPluginInstance } from "webpack";
import type { Environment } from "../environment.js";

import { SwcMinifyWebpackPlugin } from "swc-minify-webpack-plugin";

type Optimization = Configuration["optimization"];
type CacheGroups = Exclude<Optimization["splitChunks"], false>["cacheGroups"];

export function optimization(environment: Environment): Optimization {
	return {
		minimize: environment.prod,
		minimizer: getMinimizerPlugins(environment),

		runtimeChunk: {
			name: "myproject.manifest",
		},

		splitChunks: {
			cacheGroups: getCacheGroups(environment),
		},
	};
}

function getCacheGroups(environment: Environment): CacheGroups {
	return {
		// Group all asset resource chunks together; they will never be imported, and we want to hide them in the "chunks" folder
		resources: {
			filename: environment.asyncChunkFilename,
			chunks: "all",
			priority: 20,
			enforce: true,
			reuseExistingChunk: true,
			test: (module: Module) => module.type === "asset/resource",
		},

		// The common group is a single file that contains all non-async code that is not contained in an actual entry-point file
		common: {
			name: "myproject.common",
			chunks: "initial",
			minChunks: 2,
		},
	};
}

function getMinimizerPlugins(environment: Environment): WebpackPluginInstance[] {
	if (!environment.prod) {
		return [];
	}

	return [
		new SwcMinifyWebpackPlugin({
			compress: false,
			mangle: !environment.noMangle,
			ecma: 2022, // Newest version SWC supports strictly for minification purposes
			sourceMap: environment.useSourceMaps,
		}),
	];
}
