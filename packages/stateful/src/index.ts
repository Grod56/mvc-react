import { useState, useCallback } from "react";

import {
	ModelInteraction,
	ModelView,
	Model,
	InteractiveModel,
	InitializedModel,
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
	// The most valid way to "memoize" the input that I could come up with
	const [memoizedViewInteractionInterface] = useState(
		viewInteractionInterface,
	);
	const processedInitialModelView = initialModelView ?? null;
	const [memoizedModelView, setModelView] = useState<
		typeof processedInitialModelView
	>(processedInitialModelView);
	const memoizedInteract = useCallback(
		(interaction: I) => {
			memoizedViewInteractionInterface
				.produceModelView(interaction, memoizedModelView)
				.then((newModelView: V) => {
					setModelView(newModelView);
				})
				.catch(error => {
					console.error(`Interaction failed: ${String(error)}`);
				});
		},
		[memoizedViewInteractionInterface, memoizedModelView],
	);

	// Reminder to self: DO NOT memoize the output model
	const statefulModel = {
		modelView: memoizedModelView,
		interact: memoizedInteract,
	};

	return statefulModel;
}

/**Constructs stateful {@link InteractiveModel} with observable {@link ModelView},
 * which is based on the provided {@link ViewInteractionInterface} and is initialized
 * with the provided {@link ModelView}.
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
	return model as InitializedModel<typeof model>;
}

/**Constructs new stateful {@link InteractiveModel} with observable {@link ModelView},
 * which is based on the provided {@link ViewInteractionInterface}.
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
 * with observable {@link ModelView}.
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
