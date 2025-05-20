import { ModelInteraction } from "@mvc-react/mvc";
import { ViewInteractionInterface, StatifiableModel } from "../";

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
	ViewInteractionInterface<TestModelView, TestModelInteraction>,
	TestModelView
>;

export const testModelView: TestModelView = {
	displayValue: "Testing 213",
};

export const testViewInteractionInterface: TestViewInteractionInterface = {
	produceModelView: jest.fn((interaction: TestModelInteraction) => ({
		displayValue: `${interaction.type} has just been executed!`,
	})),
};

export const faultyViewInteractionInterface: TestViewInteractionInterface = {
	produceModelView: jest.fn((_: TestModelInteraction) => {
		throw new Error("Rejected!");
	}),
};

export const testStatifiableModel: TestStatifiableModel = {
	modelView: testModelView,
	viewInteractionInterface: testViewInteractionInterface,
};

export const faultyTestStatifiableModel: TestStatifiableModel = {
	modelView: testModelView,
	viewInteractionInterface: faultyViewInteractionInterface,
};
