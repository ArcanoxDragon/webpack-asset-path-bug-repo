import type { FileCacheOptions } from "webpack";
import type { Environment } from "../environment.js";

import { globbySync } from "globby";
import { resolvePath } from "../lib/util.js";

type CacheVersion = Pick<Environment, "prod" | "skipTypeCheck" | "sourceMaps" | "noSourceMaps" | "noMangle">;

export function cache(environment: Environment): FileCacheOptions {
	const { prod, skipTypeCheck, sourceMaps, noSourceMaps, noMangle } = environment;
	const cacheVersion: CacheVersion = { prod, skipTypeCheck, sourceMaps, noSourceMaps, noMangle };

	return {
		type: "filesystem",
		buildDependencies: {
			// The main config file itself along with all build-time source files which may affect the config
			mainConfig: [
				resolvePath(import.meta, "../../webpack.config.mts"),
				...globbySync("**/*.ts", { cwd: resolvePath(import.meta, ".."), absolute: true }),
			],

			// Yarn "patches" directory, storing local patches to NPM packages
			patches: globbySync("*.patch", { cwd: resolvePath(import.meta, "../../.yarn/patches"), absolute: true }),
		},
		version: JSON.stringify(cacheVersion), // Bust the cache whenever specific environment options change
	};
}
