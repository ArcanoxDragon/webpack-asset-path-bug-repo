import path from "path";

import { resolvePath } from "./lib/util.js";

const WorkspacePath = resolvePath(import.meta, "..");
const TsConfigPath = resolvePath(import.meta, "../src/tsconfig.json");
const OutputPath = path.resolve(WorkspacePath, "dist");
const PublicPath = "/Content/Bundle/";

export const constants = {
	WorkspacePath,
	TsConfigPath,
	OutputPath,
	PublicPath,
};
