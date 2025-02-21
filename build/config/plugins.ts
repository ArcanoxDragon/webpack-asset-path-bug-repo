import type { WebpackPluginInstance } from "webpack";
import type { Environment } from "../environment.js";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { constants } from "../constants.js";

import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import NodePolyfillWebpackPlugin from "node-polyfill-webpack-plugin";

export function plugins(environment: Environment): WebpackPluginInstance[] {
	const { mode, skipTypeCheck, stats } = environment;

	const plugins: WebpackPluginInstance[] = [
		// Pass webpack mode to client-side code for runtime development/production logic
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(mode),
		}),

		// Polyfill Node.js modules automatically (required specifically by Jimp/pngjs)
		new NodePolyfillWebpackPlugin(),
	];

	if (process.argv.includes("--progress")) {
		// Customize ProgressPlugin
		plugins.push(new webpack.ProgressPlugin({
			percentBy: "entries",
		}));
	}

	if (!skipTypeCheck) {
		// Run TypeScript type checking in a separate process

		plugins.push(new ForkTsCheckerWebpackPlugin({
			formatter: "basic",
			typescript: {
				configFile: constants.TsConfigPath,
			},
		}));
	}

	if (stats) {
		// Runs an analyzer server to provide bundle details in the browser

		plugins.push(new BundleAnalyzerPlugin());
	}

	return plugins;
}
