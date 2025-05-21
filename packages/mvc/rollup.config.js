import typescript from "@rollup/plugin-typescript";
import sourcemaps from "rollup-plugin-sourcemaps";
import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";

export default [
	{
		input: "src/index.ts",

		output: [
			{
				sourcemap: "inline",
				file: "dist/index.cjs",
				format: "cjs",
			},
			{
				sourcemap: "inline",
				file: "dist/index.mjs",
				format: "es",
			},
		],
		plugins: [
			typescript({
				sourceMap: true,
				inlineSources: true,
				tsconfig: "./tsconfig.json",
			}),
			sourcemaps(),
		],
	},
	{
		input: "dist/dts/index.d.ts",
		output: [
			{
				file: "dist/index.d.ts",
				format: "es",
				plugins: [],
			},
		],
		plugins: [dts(), del({ targets: "dist/dts", hook: "buildEnd" })],
	},
];
