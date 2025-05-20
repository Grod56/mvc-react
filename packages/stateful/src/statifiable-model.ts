import {
	ModelInteraction,
	ModelView,
	Model,
	// For JSDoc
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	InteractiveModel,
} from "@mvc-react/mvc";

/** Encapsulates {@link Model} that can be transformed into a stateful {@link InteractiveModel}.
 */
export interface StatifiableModel<
	V extends ViewInteractionInterface<M, ModelInteraction<T>>,
	M extends ModelView = ModelView,
	T = unknown
> extends Model<M> {
	readonly viewInteractionInterface: V;
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
	 *@returns A new model view
	 *@async
	 */
	produceModelView(interaction: I): V;
}
