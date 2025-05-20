import { act, renderHook, waitFor } from "@testing-library/react";
import {
	useInitializedStatefulInteractiveModel,
	useNewStatefulInteractiveModel,
	useTransformedStatefulInteractiveModel,
} from "../";
import {
	faultyTestStatifiableModel,
	faultyViewInteractionInterface,
	TestModelInteractionType,
	testModelView,
	testStatifiableModel,
	testViewInteractionInterface,
} from "./data";

describe("useNewStatefulInteractiveModel", () => {
	it("returns expected model", () => {
		const renderedHook = renderHook(() =>
			useNewStatefulInteractiveModel(testViewInteractionInterface)
		);
		const model = renderedHook.result.current;
		expect(model).toEqual({
			modelView: null,
			interact: expect.any(Function),
		});
	});
	it("returns identical model properties on rerender", () => {
		const renderedHook = renderHook(() =>
			useNewStatefulInteractiveModel(testViewInteractionInterface)
		);
		const model = renderedHook.result.current;
		act(() => {
			renderedHook.rerender();
		});
		const modelOnRerender = renderedHook.result.current;
		expect(modelOnRerender.modelView).toBe(model.modelView);
		expect(modelOnRerender.interact).toBe(model.interact);
	});
	it("changes model view to expected value after interaction", async () => {
		const renderedHook = renderHook(() =>
			useNewStatefulInteractiveModel(testViewInteractionInterface)
		);
		const model = renderedHook.result.current;
		act(() =>
			model.interact({ type: TestModelInteractionType.TEST, input: null })
		);
		const expectedModelView =
			await testViewInteractionInterface.produceModelView({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		waitFor(() => {
			const currentModelView = renderedHook.result.current.modelView;
			expect(currentModelView).toEqual(expectedModelView);
		});
	});
	it("reports error when interaction fails", () => {
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation();
		const renderedHook = renderHook(() =>
			useNewStatefulInteractiveModel(faultyViewInteractionInterface)
		);
		const model = renderedHook.result.current;
		act(() => {
			model.interact({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		});
		waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String));
		});
	});
});
describe("useInitializedStatefulInteractiveModel", () => {
	it("returns expected model", () => {
		const renderedHook = renderHook(() =>
			useInitializedStatefulInteractiveModel(
				testViewInteractionInterface,
				testModelView
			)
		);
		const model = renderedHook.result.current;
		expect(model).toEqual({
			modelView: testModelView,
			interact: expect.any(Function),
		});
	});
	it("returns identical model properties on rerender", () => {
		const renderedHook = renderHook(() =>
			useInitializedStatefulInteractiveModel(
				testViewInteractionInterface,
				testModelView
			)
		);
		const model = renderedHook.result.current;
		act(() => {
			renderedHook.rerender();
		});
		const modelOnRerender = renderedHook.result.current;
		expect(modelOnRerender.modelView).toBe(model.modelView);
		expect(modelOnRerender.interact).toBe(model.interact);
	});
	it("changes model view to expected value after interaction", async () => {
		const renderedHook = renderHook(() =>
			useInitializedStatefulInteractiveModel(
				testViewInteractionInterface,
				testModelView
			)
		);
		const model = renderedHook.result.current;
		act(() =>
			model.interact({ type: TestModelInteractionType.TEST, input: null })
		);
		const expectedModelView =
			await testViewInteractionInterface.produceModelView({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		waitFor(() => {
			const currentModelView = renderedHook.result.current.modelView;
			expect(currentModelView).toEqual(expectedModelView);
		});
	});
	it("reports error when an interaction fails", () => {
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation();
		const renderedHook = renderHook(() =>
			useInitializedStatefulInteractiveModel(
				faultyViewInteractionInterface,
				testModelView
			)
		);
		const model = renderedHook.result.current;
		act(() => {
			model.interact({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		});
		waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String));
		});
	});
});
describe("useTransformedStatefulInteractiveModel", () => {
	it("returns equivalent model", () => {
		const renderedHook = renderHook(() =>
			useTransformedStatefulInteractiveModel(testStatifiableModel)
		);
		const model = renderedHook.result.current;
		expect(model).toEqual({
			modelView: testStatifiableModel.modelView,
			interact: expect.any(Function),
		});
	});
	it("returns identical model properties on rerender", () => {
		const renderedHook = renderHook(() =>
			useTransformedStatefulInteractiveModel(testStatifiableModel)
		);
		const model = renderedHook.result.current;
		act(() => {
			renderedHook.rerender();
		});
		const modelOnRerender = renderedHook.result.current;
		expect(modelOnRerender.modelView).toBe(model.modelView);
		expect(modelOnRerender.interact).toBe(model.interact);
	});
	it("changes model view to expected value after interaction", async () => {
		const renderedHook = renderHook(() =>
			useTransformedStatefulInteractiveModel(testStatifiableModel)
		);
		const model = renderedHook.result.current;
		act(() =>
			model.interact({ type: TestModelInteractionType.TEST, input: null })
		);
		const expectedModelView =
			await testStatifiableModel.viewInteractionInterface.produceModelView(
				{
					type: TestModelInteractionType.TEST,
					input: null,
				}
			);
		waitFor(() => {
			const currentModelView = renderedHook.result.current.modelView;
			expect(currentModelView).toEqual(expectedModelView);
		});
	});
	it("reports error when an interaction fails", () => {
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation();
		const renderedHook = renderHook(() =>
			useTransformedStatefulInteractiveModel(faultyTestStatifiableModel)
		);
		const model = renderedHook.result.current;
		act(() => {
			model.interact({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		});
		waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String));
		});
	});
});
