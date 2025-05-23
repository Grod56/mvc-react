import React from "react";
import { act, render, renderHook, screen } from "@testing-library/react";
import { useTestData } from "./data";
import { ComponentPlaceholder } from "../..";

describe("ComponentPlaceholder", () => {
	const getPlaceholderedComponent = () =>
		jest.fn(() => <div data-testid="placeholdered"></div>);
	const getPlaceholderComponent = () =>
		jest.fn(() => <div data-testid="placeholder"></div>);

	beforeAll(() => {
		const renderedHook = renderHook(() =>
			useTestData(getPlaceholderedComponent(), getPlaceholderComponent())
		);
		const { PlaceholderComponent, PlaceholderedComponent } =
			renderedHook.result.current.testModel.modelView;
		expect(PlaceholderComponent).not.toHaveBeenCalled();
		expect(PlaceholderedComponent).not.toHaveBeenCalled();
	});

	it("only renders PlaceholderComponent when placeholderedComponentModel is undefined", () => {
		const renderedHook = renderHook(() =>
			useTestData(getPlaceholderedComponent(), getPlaceholderComponent())
		);
		act(() =>
			renderedHook.result.current.setPlaceholderedComponentModel(
				undefined
			)
		);

		const { testModel } = renderedHook.result.current;

		const rendered = render(<ComponentPlaceholder model={testModel} />);
		const containerElement = rendered.container;
		const selectedElement = screen.getByTestId("placeholder");

		expect(selectedElement).toEqual(containerElement.firstChild);
		expect(selectedElement).toEqual(containerElement.lastChild);
	});

	it(
		"only renders PlaceholderedComponent when when placeholderedComponentModel " +
			"is truthy",
		() => {
			const renderedHook = renderHook(() =>
				useTestData(
					getPlaceholderedComponent(),
					getPlaceholderComponent()
				)
			);
			act(() =>
				renderedHook.result.current.setPlaceholderedComponentModel({
					modelView: { text: "spring" },
				})
			);

			const { testModel } = renderedHook.result.current;

			const rendered = render(<ComponentPlaceholder model={testModel} />);
			const containerElement = rendered.container;
			const selectedElement = screen.getByTestId("placeholdered");

			expect(selectedElement).toEqual(containerElement.firstChild);
			expect(selectedElement).toEqual(containerElement.lastChild);
		}
	);
});
