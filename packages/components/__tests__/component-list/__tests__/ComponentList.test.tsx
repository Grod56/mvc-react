import React from "react";
import { render, screen } from "@testing-library/react";
import { getTestModel } from "./data";
import { ComponentList } from "../../../src";

describe("ComponentList", () => {
	const getTestComponent = () =>
		jest.fn(({ model }) => <li>{model.modelView.text}</li>);

	it("renders all componentModels", () => {
		const testModel = getTestModel(getTestComponent());
		const rendered = render(<ComponentList model={testModel} />);

		const { componentModels } = testModel.modelView;
		const containerElement = rendered.container;

		componentModels.forEach((componentModel, index) => {
			const element = screen.queryByText(componentModel.modelView.text);
			expect(containerElement.childNodes[index]).toBe(element);
		});
	});
});
