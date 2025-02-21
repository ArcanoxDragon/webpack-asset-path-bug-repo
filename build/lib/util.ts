import { fileURLToPath } from "url";

import * as path from "path";

export function resolvePath(importMeta: ImportMeta, ...paths: string[]): string {
	const baseFileName = fileURLToPath(importMeta.url);
	const basePath = path.dirname(baseFileName);

	return path.resolve(basePath, ...paths);
}
