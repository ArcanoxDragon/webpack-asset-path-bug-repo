import type { Configuration } from "webpack";

export interface EnvironmentOptions {
	prod: boolean;
	stats: boolean;
	skipTypeCheck: boolean;
	skipLinting: boolean;
	noSourceMaps: boolean;
	sourceMaps: boolean;
	noMangle: boolean;
}

export const DefaultEnvironment: EnvironmentOptions = {
	prod: false,
	stats: false,
	skipTypeCheck: false,
	skipLinting: false,
	noSourceMaps: false,
	sourceMaps: false,
	noMangle: false,
};

export class Environment implements Readonly<EnvironmentOptions> {
	readonly prod: boolean;
	readonly stats: boolean;
	readonly skipTypeCheck: boolean;
	readonly skipLinting: boolean;
	readonly noSourceMaps: boolean;
	readonly sourceMaps: boolean;
	readonly noMangle: boolean;

	constructor(options: EnvironmentOptions) {
		Object.assign(this, options);
	}

	get mode(): Configuration["mode"] {
		return this.prod ? "production" : "development";
	}

	get useSourceMaps(): boolean {
		return this.sourceMaps || (!this.prod && !this.noSourceMaps);
	}

	get cacheBuster(): string {
		// Webpack recommends not using chunk hashes in development mode (it can slow down builds). In order to
		// properly bust caches when first rebuilding the Webpack workspace, we use the current timestamp as a
		// hard-coded cache buster in development mode. We use the actual hash in production mode.
		return this.prod ? "[chunkhash]" : new Date().valueOf().toString();
	}

	get chunkFilename(): string {
		return `js/[name].js?v=${this.cacheBuster}`;
	}

	get vendorChunkFilename(): string {
		return `js/myproject.vendor.[name].js?v=${this.cacheBuster}`;
	}

	get asyncChunkFilename(): string {
		return `js/chunks/[id].js?v=${this.cacheBuster}`;
	}
}

export function getEnvironment(options: EnvironmentOptions) {
	const effectiveOptions = { ...DefaultEnvironment, ...options };

	return new Environment(effectiveOptions);
}
