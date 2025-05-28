import { ModelInteraction } from "@mvc-react/mvc";
import { ViewInteractionInterface, StatifiableModel } from "..";

export interface TestModelView {
	displayValue: string;
}

export enum TestModelInteractionType {
	TEST,
}

export type TestModelInteraction = ModelInteraction<TestModelInteractionType>;
export type TestViewInteractionInterface = ViewInteractionInterface<
	TestModelView,
	TestModelInteraction
>;
export type TestStatifiableModel = StatifiableModel<
	TestModelView,
	TestModelInteraction
>;

export const testModelView: TestModelView = {
	displayValue: "Testing 213",
};

export const testViewInteractionInterface: TestViewInteractionInterface = {
	produceModelView: jest.fn((interaction: TestModelInteraction) =>
		Promise.resolve({
			displayValue: `${interaction.type} has just been executed!`,
		}),
	),
};

export function faultyViewInteractionInterface(
	errorMessage: string,
): TestViewInteractionInterface {
	return {
		produceModelView: jest.fn((_: TestModelInteraction) => {
			return Promise.reject(errorMessage);
		}),
	};
}

export const testStatifiableModel: TestStatifiableModel = {
	modelView: testModelView,
	viewInteractionInterface: testViewInteractionInterface,
};

export function faultyTestStatifiableModel(
	errorMessage: string,
): TestStatifiableModel {
	return {
		modelView: testModelView,
		viewInteractionInterface: faultyViewInteractionInterface(errorMessage),
	};
}
