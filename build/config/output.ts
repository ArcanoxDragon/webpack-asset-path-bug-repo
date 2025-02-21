import type { Configuration } from "webpack";

import { Environment } from "../environment.js";
import { constants } from "../constants.js";

type Output = Configuration["output"];

export function output(environment: Environment): Output {
	return {
		path: constants.OutputPath,
		filename: environment.chunkFilename,
		chunkFilename: environment.asyncChunkFilename,
		assetModuleFilename: "[name][ext][query]",
		publicPath: constants.PublicPath,
	};
}
