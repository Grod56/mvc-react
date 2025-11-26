import { useState } from "react";
import { ConditionalComponentModel, GeneralComponent } from "../..";

export type TestCondition = "AB" | "CD";

export type TestConditionalComponentModel =
	ConditionalComponentModel<TestCondition>;

export function useTestData(
	components: Map<TestCondition, GeneralComponent>,
	FallbackComponent: GeneralComponent,
) {
	const [condition, setCondition] = useState<TestCondition>("AB");
	const testModel: ConditionalComponentModel<TestCondition> = {
		modelView: {
			condition: condition,
			components: components,
			FallbackComponent,
		},
	};
	return { testModel, setCondition };
}
