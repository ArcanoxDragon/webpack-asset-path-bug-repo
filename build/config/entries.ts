import type { EntryObject } from "webpack";

import { getScriptEntryPoints } from "../lib/getScriptEntryPoints.js";
import { getStyleEntryPoints } from "../lib/getStyleEntryPoints.js";

export function entries(): EntryObject {
	return {
		// All script entry points for TS
		...getScriptEntryPoints(),
		// All style entry points for SASS
		...getStyleEntryPoints(),
	};
}
