import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
	testEnvironment: "jsdom",
	transform: {
		...tsJestTransformCfg,
	},
	testPathIgnorePatterns: ["\\\\node_modules\\\\", "data.ts"],
};
