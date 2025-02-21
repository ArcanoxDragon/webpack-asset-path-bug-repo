import type { Configuration } from "webpack";

import { EnvironmentOptions, getEnvironment } from "./build/environment.js";
import { registerExceptionSerializer, resolvePath } from "./build/lib/index.js";

import * as config from "./build/config/index.js";

export default function buildConfig(env: EnvironmentOptions): Configuration {
	const environment = getEnvironment(env);
	const { mode, stats } = environment;

	registerExceptionSerializer();

	return {
		name: "app",
		context: resolvePath(import.meta, "."),
		mode,
		devtool: environment.useSourceMaps ? "source-map" : false,
		node: false,
		parallelism: stats ? 1 : undefined,

		cache: config.cache(environment),
		entry: config.entries,
		optimization: config.optimization(environment),
		output: config.output(environment),
		plugins: config.plugins(environment),

		performance: {
			hints: false,
		},

		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx"],

			fallback: {
				fs: false,
			},

			alias: {
				"paper": "paper/dist/paper-core",
				"es-is/number": "es-is/number.js",
			},
		},

		experiments: {
			css: false,
			topLevelAwait: true,
			futureDefaults: true,
		},

		externals: {
			jquery: "jQuery",
		},

		module: {
			parser: {
				javascript: {
					exportsPresence: false,
				},
			},

			rules: config.moduleRules(environment),
		},

		watchOptions: {
			aggregateTimeout: 500,
			ignored: /node_modules/,
		},
	};
}