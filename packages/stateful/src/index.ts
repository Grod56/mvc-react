import { useState, useCallback } from "react";
import {
	ViewInteractionInterface,
	StatifiableModel,
} from "./statifiable-model.js";
import { InteractiveModel, ModelInteraction, ModelView } from "@mvc-react/mvc";

/**Constructs stateful {@link InteractiveModel} with observable {@link ModelView},
 * which is based on the provided {@link ViewInteractionInterface} and is initialized
 * with the provided {@link ModelView}.
 * @param viewInteractionInterface - Interface which will determine how the model view mutates according to the provided interactions
 * @param initialModelView - Initial model view for the returned model
 * @returns New readonly {@link InteractiveModel} initialized with `initialModelView`
 * */
export function useInitializedStatefulInteractiveModel<
	T extends InteractiveModel<U, ModelInteraction<V>>,
	U extends ModelView = ModelView,
	V = unknown,
	W extends ViewInteractionInterface<
		U,
		ModelInteraction<V>
	> = ViewInteractionInterface<U, ModelInteraction<V>>
>(viewInteractionInterface: W, initialModelView: U): Readonly<T> {
	// The most valid way to "memoize" the input that I could come up with
	const [memoizedViewInteractionInterface] = useState<W>(
		viewInteractionInterface
	);
	const [memoizedModelView, setModelView] = useState<U>(initialModelView);
	const memoizedInteract = useCallback(
		async (interaction: ModelInteraction<V>) => {
			try {
				const newModelView =
					await memoizedViewInteractionInterface.produceModelView(
						interaction
					);
				setModelView(newModelView);
			} catch (error) {
				throw new Error("Interaction failed", {
					cause: new Error(String(error)),
				});
			}
		},
		[memoizedViewInteractionInterface]
	);

	// Reminder to self: DO NOT memoize the output model
	const statefulModel = {
		modelView: memoizedModelView,
		interact: memoizedInteract,
	};

	return statefulModel as T;
}

/**Constructs new stateful {@link InteractiveModel} with observable {@link ModelView},
 * which is based on the provided {@link ViewInteractionInterface}.
 * @param viewInteractionInterface - Interface which will determine how the model view mutates according to the provided interactions
 * @returns New readonly {@link InteractiveModel} with uninitialized (`null`) {@link ModelView}
 *  */
export function useNewStatefulInteractiveModel<
	T extends InteractiveModel<U, ModelInteraction<V>>,
	U extends ModelView = ModelView,
	V = unknown,
	W extends ViewInteractionInterface<
		U,
		ModelInteraction<V>
	> = ViewInteractionInterface<U, ModelInteraction<V>>
>(viewInteractionInterface: W): Readonly<T> {
	return useInitializedStatefulInteractiveModel<T>(
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
	T extends InteractiveModel<U, ModelInteraction<V>>,
	U extends ModelView = ModelView,
	V = unknown,
	W extends ViewInteractionInterface<
		U,
		ModelInteraction<V>
	> = ViewInteractionInterface<U, ModelInteraction<V>>
>(model: StatifiableModel<W>): Readonly<T> {
	return useInitializedStatefulInteractiveModel<T>(
		model.viewInteractionInterface,
		model.modelView
	);
}
