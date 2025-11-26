import React from "react";
import { act, render, renderHook, screen } from "@testing-library/react";
import { TestCondition, useTestData } from "./data";
import { ConditionalComponent, GeneralComponent } from "../..";

describe("ConditionalComponent", () => {
	const getComponents = () =>
		new Map<TestCondition, GeneralComponent>([
			["AB", jest.fn(() => <div data-testid="AB" />)],
		]);
	const getFallbackComponent = () =>
		jest.fn(() => <div data-testid="fallback" />);

	beforeAll(() => {
		const renderedHook = renderHook(() =>
			useTestData(getComponents(), getFallbackComponent()),
		);
		const { testModel } = renderedHook.result.current;
		const { components, FallbackComponent } = testModel.modelView;
		for (const component of components.values()) {
			expect(component).not.toHaveBeenCalled();
		}
		expect(FallbackComponent).not.toHaveBeenCalled();
	});

	it("only renders Component relevant to provided condition", () => {
		const renderedHook = renderHook(() =>
			useTestData(getComponents(), getFallbackComponent()),
		);
		const { setCondition } = renderedHook.result.current;

		act(() => setCondition("AB"));

		const rendered = render(
			<ConditionalComponent
				model={renderedHook.result.current.testModel}
			/>,
		);

		const containerElement = rendered.container;
		const selectedElement = screen.getByTestId("AB");

		expect(selectedElement).toBe(containerElement.firstChild);
		expect(selectedElement).toBe(containerElement.lastChild);
	});

	it("only renders fallback component when condition is unmapped", () => {
		const renderedHook = renderHook(() =>
			useTestData(getComponents(), getFallbackComponent()),
		);
		const { setCondition } = renderedHook.result.current;

		act(() => setCondition("CD"));

		const rendered = render(
			<ConditionalComponent
				model={renderedHook.result.current.testModel}
			/>,
		);

		const containerElement = rendered.container;
		const selectedElement = screen.getByTestId("fallback");

		expect(selectedElement).toEqual(containerElement.firstChild);
		expect(selectedElement).toEqual(containerElement.lastChild);
	});
});
