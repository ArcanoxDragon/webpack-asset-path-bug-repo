import { globbySync } from "globby";
import { EntryObject } from "webpack";
import { resolvePath } from "./util.js";

export function getStyleEntryPoints(): EntryObject {
	const entries: EntryObject = {};
	const entryFiles = globbySync(
		[
			`styles/**/*.scss`,
			`!styles/**/_*.scss`,
		],
		{ cwd: resolvePath(import.meta, "../../src") }
	);

	for (const file of entryFiles.sort()) {
		// Trim off extension and normalize filenames
		const match = file.match(/styles[\\/](.+)\.scss$/i);

		if (!match) {
			throw new Error(`Invalid entrypoint file found: ${file}`);
		}

		const [, entryName] = match;

		entries[`styles/${entryName}`] = `./src/${file}`;
	}

	return entries;
}
