import del from "rollup-plugin-delete";
import { dts } from "rollup-plugin-dts";

export default [
	{
		input: "src/index.d.ts",
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
