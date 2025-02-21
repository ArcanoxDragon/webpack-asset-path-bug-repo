import webpack from "webpack";
import { Exception } from "sass-embedded";

type Arguments<T> = T extends ((...args: infer Args) => unknown) ? Args : never;
type Constructor = Arguments<typeof webpack.util.serialization.registerNotSerializable>[0];

export function registerExceptionSerializer() {
	// Stupid class is decorated with a "private constructor" (which is being used more closely to "internal")
	// so we have to trick TypeScript into allowing us to pass it
	webpack.util.serialization.registerNotSerializable(Exception as unknown as Constructor);
}
