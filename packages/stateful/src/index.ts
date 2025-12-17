import { useState, useCallback } from "react";

import {
	ModelInteraction,
	ModelView,
	Model,
	InteractiveModel,
	InitializedInteractiveModel,
} from "@mvc-react/mvc";

/** Encapsulates {@link Model} that can be transformed into a stateful {@link InteractiveModel}.
 */
export interface StatifiableModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown,
> extends Model<V> {
	readonly viewInteractionInterface: ViewInteractionInterface<V, I>;
}

/**Encapsulates interface that produces a {@link ModelView}
 * according to a provided {@link ModelInteraction}. */
export interface ViewInteractionInterface<
	V extends ModelView,
	I extends ModelInteraction<T>,
	T = unknown,
> {
	/**Produces a {@link ModelView} according to the provided {@link ModelInteraction}.
	 *@param interaction - The interaction to be executed
	 *@param currentModelView - The current model view
	 *@returns A Promise for the produced model view
	 */
	produceModelView(interaction: I, currentModelView: V | null): Promise<V>;
}

function useStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown,
>(
	viewInteractionInterface: ViewInteractionInterface<V, I>,
	initialModelView?: V | null,
): Readonly<InteractiveModel<V, I>> {
	const processedInitialModelView = initialModelView ?? null;
	const [statefulModelView, setModelView] = useState<
		typeof processedInitialModelView
	>(processedInitialModelView);
	// TODO: Add tests to factor in this change
	const memoizedInteract = useCallback(
		async (interaction: I) => {
			await viewInteractionInterface
				.produceModelView(interaction, statefulModelView)
				.then((newModelView: V) => {
					setModelView(newModelView);
				})
				.catch(error => {
					console.error(`Interaction failed: ${String(error)}`);
					return Promise.reject(error);
				});
		},
		[statefulModelView, viewInteractionInterface],
	);

	// Reminder to self: DO NOT memoize the output model
	const statefulModel = {
		modelView: statefulModelView,
		interact: memoizedInteract,
	};

	return statefulModel;
}

/**Constructs stateful {@link InteractiveModel} with observable {@link ModelView} and
 * asynchronous `interact` function, which is based on the provided
 * {@link ViewInteractionInterface} and is initialized with the provided {@link ModelView}.
 * @param viewInteractionInterface - Interface which will determine how the model view mutates according to the provided interactions
 * @param initialModelView - Initial model view for the returned model
 * @returns New readonly {@link InitializedInteractiveModel} initialized with `initialModelView`
 * */
export function useInitializedStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown,
>(
	viewInteractionInterface: ViewInteractionInterface<V, I>,
	initialModelView: V,
) {
	const model = useStatefulInteractiveModel<V, I>(
		viewInteractionInterface,
		initialModelView,
	);
	return model as InitializedInteractiveModel<V, I>;
}

/**Constructs new stateful {@link InteractiveModel} with observable {@link ModelView} and
 * asynchronous `interact` function, which is based on the provided {@link ViewInteractionInterface}
 * @param viewInteractionInterface - Interface which will determine how the model view mutates according to the provided interactions
 * @returns New readonly {@link InteractiveModel} with uninitialized (`null`) {@link ModelView}
 */
export function useNewStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown,
>(viewInteractionInterface: ViewInteractionInterface<V, I>) {
	return useStatefulInteractiveModel<V, I>(viewInteractionInterface);
}

/**Transforms provided {@link StatifiableModel} into new stateful {@link InteractiveModel}
 * with observable {@link ModelView} and asynchronous `interact` function.
 * @param model - Model to be transformed
 * @returns New readonly {@link InteractiveModel} initialized with `model`'s {@link ModelView}
 */
export function useTransformedStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown,
>(model: StatifiableModel<V, I>) {
	return useStatefulInteractiveModel<V, I>(
		model.viewInteractionInterface,
		model.modelView,
	);
}
