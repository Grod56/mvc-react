import { useState } from "react";
import { Model } from "@mvc-react/mvc";
import {
	ComponentPlaceholderModel,
	GeneralComponent,
	ModeledVoidComponent,
} from "../..";

type TestPlaceholderedComponentModelView = {
	text: string;
};

export type TestPlaceholderedComponentModel =
	Model<TestPlaceholderedComponentModelView>;

export function useTestData(
	PlaceholderedComponent: ModeledVoidComponent<TestPlaceholderedComponentModel>,
	PlaceholderComponent: GeneralComponent
) {
	const [placeholderedComponentModel, setPlaceholderedComponentModel] =
		useState<TestPlaceholderedComponentModel | undefined>(undefined);
	const testModel: ComponentPlaceholderModel<TestPlaceholderedComponentModel> =
		{
			modelView: {
				placeholderedComponentModel: placeholderedComponentModel,
				PlaceholderedComponent: PlaceholderedComponent,
				PlaceholderComponent: PlaceholderComponent,
			},
		};

	return { testModel, setPlaceholderedComponentModel };
}
