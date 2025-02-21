import { globbySync } from "globby";
import { EntryObject } from "webpack";
import { resolvePath } from "./util.js";

export function getScriptEntryPoints(): EntryObject {
	const entries: EntryObject = {};
	const entryFiles = globbySync(
		[
			// "script" entry points (page scripts, etc.)
			`scripts/**/*.ts?(x)`,
		],
		{ cwd: resolvePath(import.meta, "../../src") }
	);

	for (const file of entryFiles.sort()) {
		// Map scripts/<script_name> to just <script_name>
		const match = file.match(/scripts[\\/](.+)\.tsx?$/i);

		if (!match) {
			throw new Error(`Invalid entrypoint file found: ${file}`);
		}

		const [, entryName] = match;

		entries[`${entryName}`] = `./src/${file}`;
	}

	return entries;
}
