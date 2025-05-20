import {
	act,
	renderHook,
	RenderHookResult,
	waitFor,
} from "@testing-library/react";
import {
	useInitializedStatefulInteractiveModel,
	useNewStatefulInteractiveModel,
	useTransformedStatefulInteractiveModel,
} from "../";
import {
	faultyTestStatifiableModel,
	faultyViewInteractionInterface,
	TestModelInteraction,
	TestModelInteractionType,
	TestModelView,
	testModelView,
	testStatifiableModel,
	testViewInteractionInterface,
} from "./data";
import { InteractiveModel } from "@mvc-react/mvc";

describe("useNewStatefulInteractiveModel", () => {
	// Potential tidying re. generics needed
	let renderedHook: RenderHookResult<
		InteractiveModel<TestModelView, TestModelInteraction>,
		unknown
	>;
	let model: InteractiveModel<TestModelView, TestModelInteraction>;

	beforeEach(() => {
		renderedHook = renderHook(() =>
			useNewStatefulInteractiveModel(testViewInteractionInterface)
		);
		model = renderedHook.result.current;
	});
	afterEach(() => {
		renderedHook.unmount();
	});

	it("returns expected model", () => {
		expect(model).toEqual({
			modelView: null,
			interact: expect.any(Function),
		});
	});
	it("returns identical model properties on rerender", () => {
		act(() => {
			renderedHook.rerender();
		});
		const modelOnRerender = renderedHook.result.current;
		expect(modelOnRerender.modelView).toBe(model.modelView);
		expect(modelOnRerender.interact).toBe(model.interact);
	});
	it("changes model view to expected value after interaction", async () => {
		await act(() =>
			model.interact({ type: TestModelInteractionType.TEST, input: null })
		);
		const expectedModelView =
			await testViewInteractionInterface.produceModelView({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		const currentModelView = renderedHook.result.current.modelView;
		expect(currentModelView).toEqual(expectedModelView);
	});
	it("throws error when an interaction fails", () => {
		renderedHook = renderHook(() =>
			useNewStatefulInteractiveModel(faultyViewInteractionInterface)
		);
		model = renderedHook.result.current;
		expect(
			waitFor(() =>
				model.interact({
					type: TestModelInteractionType.TEST,
					input: null,
				})
			)
		).rejects.toThrow(expect.any(String));
	});
});
describe("useInitializedStatefulInteractiveModel", () => {
	let renderedHook: RenderHookResult<
		InteractiveModel<TestModelView, TestModelInteraction>,
		unknown
	>;
	let model: InteractiveModel<TestModelView, TestModelInteraction>;

	beforeEach(() => {
		renderedHook = renderHook(() =>
			useInitializedStatefulInteractiveModel(
				testViewInteractionInterface,
				testModelView
			)
		);
		model = renderedHook.result.current;
	});
	afterEach(() => {
		renderedHook.unmount();
	});

	it("returns expected model", () => {
		expect(model).toEqual({
			modelView: testModelView,
			interact: expect.any(Function),
		});
	});
	it("returns identical model properties on rerender", () => {
		act(() => {
			renderedHook.rerender();
		});
		const modelOnRerender = renderedHook.result.current;
		expect(modelOnRerender.modelView).toBe(model.modelView);
		expect(modelOnRerender.interact).toBe(model.interact);
	});
	it("changes model view to expected value after interaction", async () => {
		await act(() =>
			model.interact({ type: TestModelInteractionType.TEST, input: null })
		);
		const expectedModelView =
			await testViewInteractionInterface.produceModelView({
				type: TestModelInteractionType.TEST,
				input: null,
			});
		const currentModelView = renderedHook.result.current.modelView;
		expect(currentModelView).toEqual(expectedModelView);
	});
	it("throws error when an interaction fails", async () => {
		renderedHook = renderHook(() =>
			useInitializedStatefulInteractiveModel(
				faultyViewInteractionInterface,
				testModelView
			)
		);
		model = renderedHook.result.current;
		expect(
			waitFor(() =>
				model.interact({
					type: TestModelInteractionType.TEST,
					input: null,
				})
			)
		).rejects.toThrow(expect.any(String));
	});
});
describe("useTransformedStatefulInteractiveModel", () => {
	let renderedHook: RenderHookResult<
		InteractiveModel<TestModelView, TestModelInteraction>,
		unknown
	>;
	let model: InteractiveModel<TestModelView, TestModelInteraction>;

	beforeEach(() => {
		renderedHook = renderHook(() =>
			useTransformedStatefulInteractiveModel(testStatifiableModel)
		);
		model = renderedHook.result.current;
	});
	afterEach(() => {
		renderedHook.unmount();
	});

	it("returns equivalent model", () => {
		expect(model).toEqual({
			modelView: testStatifiableModel.modelView,
			interact: expect.any(Function),
		});
	});
	it("returns identical model properties on rerender", () => {
		act(() => {
			renderedHook.rerender();
		});
		const modelOnRerender = renderedHook.result.current;
		expect(modelOnRerender.modelView).toBe(model.modelView);
		expect(modelOnRerender.interact).toBe(model.interact);
	});
	it("changes model view to expected value after interaction", async () => {
		await act(() =>
			model.interact({ type: TestModelInteractionType.TEST, input: null })
		);
		const expectedModelView =
			await testStatifiableModel.viewInteractionInterface.produceModelView(
				{
					type: TestModelInteractionType.TEST,
					input: null,
				}
			);
		const currentModelView = renderedHook.result.current.modelView;
		expect(currentModelView).toEqual(expectedModelView);
	});
	it("throws error when an interaction fails", () => {
		renderedHook = renderHook(() =>
			useTransformedStatefulInteractiveModel(faultyTestStatifiableModel)
		);
		model = renderedHook.result.current;
		expect(
			waitFor(() =>
				model.interact({
					type: TestModelInteractionType.TEST,
					input: null,
				})
			)
		).rejects.toThrow(expect.any(String));
	});
});
