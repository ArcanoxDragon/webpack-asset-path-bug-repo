import { sayHello } from "../lib/util";

document.addEventListener("readystatechange", e => {
	if (document.readyState === "complete") {
		sayHello();
	}
});