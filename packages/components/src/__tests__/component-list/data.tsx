import { ReadonlyModel } from "@mvc-react/mvc";
import { ComponentListModel, ModeledVoidComponent } from "../..";

type TestModelView = {
	text: string;
};

export type TestModel = ReadonlyModel<TestModelView>;

const testComponentModels: TestModel[] = [
	{ modelView: { text: "summer" } },
	{ modelView: { text: "autumn" } },
	{ modelView: { text: "winter" } },
	{ modelView: { text: "spring" } },
];

export function getTestModel(
	Component: ModeledVoidComponent<TestModel>,
): ComponentListModel<TestModel> {
	const model = {
		modelView: {
			componentModels: testComponentModels,
			Component,
		},
	};
	return model;
}
