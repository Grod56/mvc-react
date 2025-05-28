/**Encapsulates the essence of any ontological item
 * (e.g. component, repository, database table record, etc.). */
export interface Model<V extends ModelView> {
	/**The model's {@link ModelView} */
	modelView: Readonly<V> | null;
}

/**Encapsulates what a client sees/the current 'state' of a {@link Model}. */
export type ModelView = object;

//------------------------------------------------------------

/**Encapsulates {@link Model} with unchanging {@link ModelView}. */
export interface ReadonlyModel<V extends ModelView> extends Model<V> {
	readonly modelView: Readonly<V>;
}

//------------------------------------------------------------

/**Encapsulates {@link Model} whose {@link ModelView} changes according to
 * provided interactions. */
export interface InteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<T>,
	T = unknown,
> extends Readonly<Model<V>> {
	/**Initiates a model interaction.
	 * @param interaction - Interaction to be executed.
	 */
	interact(interaction: I): void;
}

/**Encapsulates a singular model interaction/activity
 * which accordingly mutates the {@link Model}'s {@link ModelView}. */
export interface ModelInteraction<T> {
	/**The kind of interaction. */
	readonly type: T;
}

/**{@link ModelInteraction} with input data */
export interface InputModelInteraction<T, I extends object>
	extends ModelInteraction<T> {
	/**The interaction's corresponding input data */
	readonly input: I;
}

/**Convenience function for constructing a new {@link ReadonlyModel}
 * @param modelView - Model view of model to be constructed
 * @returns New readonly model initialized with `modelView`
 */
export function newReadonlyModel<V extends object>(
	modelView: V,
): ReadonlyModel<V> {
	return Object.freeze({ modelView });
}
