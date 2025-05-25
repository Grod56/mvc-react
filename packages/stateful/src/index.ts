import { useState, useCallback } from "react";

import {
	ModelInteraction,
	ModelView,
	Model,
	InteractiveModel,
} from "@mvc-react/mvc";

/** Encapsulates {@link Model} that can be transformed into a stateful {@link InteractiveModel}.
 */
export interface StatifiableModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown
> extends Model<V> {
	readonly viewInteractionInterface: ViewInteractionInterface<V, I>;
}

/**Encapsulates interface that produces a {@link ModelView}
 * according to a provided {@link ModelInteraction}. */
export interface ViewInteractionInterface<
	V extends ModelView,
	I extends ModelInteraction<T>,
	T = unknown
> {
	/**Produces a {@link ModelView} according to the provided {@link ModelInteraction}.
	 *@param interaction - The interaction to be executed
	 *@returns A Promise for the produced model view
	 */
	produceModelView(interaction: I): Promise<V>;
}

/**Constructs stateful {@link InteractiveModel} with observable {@link ModelView},
 * which is based on the provided {@link ViewInteractionInterface} and is initialized
 * with the provided {@link ModelView}.
 * @param viewInteractionInterface - Interface which will determine how the model view mutates according to the provided interactions
 * @param initialModelView - Initial model view for the returned model
 * @returns New readonly {@link InteractiveModel} initialized with `initialModelView`
 * */
export function useInitializedStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown
>(
	viewInteractionInterface: ViewInteractionInterface<V, I>,
	initialModelView: V | null
): Readonly<InteractiveModel<V, I>> {
	// The most valid way to "memoize" the input that I could come up with
	const [memoizedViewInteractionInterface] = useState(
		viewInteractionInterface
	);
	const [memoizedModelView, setModelView] = useState<V | null>(
		initialModelView
	);
	const memoizedInteract = useCallback(
		(interaction: I) => {
			memoizedViewInteractionInterface
				.produceModelView(interaction)
				.then((newModelView: V) => {
					setModelView(newModelView);
				})
				.catch((error) => {
					console.error(`Interaction failed: ${String(error)}`);
				});
		},
		[memoizedViewInteractionInterface]
	);

	// Reminder to self: DO NOT memoize the output model
	const statefulModel = {
		modelView: memoizedModelView,
		interact: memoizedInteract,
	};

	return statefulModel;
}

/**Constructs new stateful {@link InteractiveModel} with observable {@link ModelView},
 * which is based on the provided {@link ViewInteractionInterface}.
 * @param viewInteractionInterface - Interface which will determine how the model view mutates according to the provided interactions
 * @returns New readonly {@link InteractiveModel} with uninitialized (`null`) {@link ModelView}
 */
export function useNewStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown
>(
	viewInteractionInterface: ViewInteractionInterface<V, I>
): Readonly<InteractiveModel<V, I>> {
	return useInitializedStatefulInteractiveModel<V, I>(
		viewInteractionInterface,
		null
	);
}

/**Transforms provided {@link StatifiableModel} into new stateful {@link InteractiveModel}
 * with observable {@link ModelView}.
 * @param model - Model to be transformed
 * @returns New readonly {@link InteractiveModel} initialized with `model`'s {@link ModelView}
 */
export function useTransformedStatefulInteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<U>,
	U = unknown
>(model: StatifiableModel<V, I>): Readonly<InteractiveModel<V, I>> {
	return useInitializedStatefulInteractiveModel<V, I>(
		model.viewInteractionInterface,
		model.modelView
	);
}
