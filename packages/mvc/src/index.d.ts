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
export type ReadonlyModel<V extends ModelView> = Readonly<Model<V>>;

//------------------------------------------------------------

/**Encapsulates {@link Model} whose {@link ModelView} changes according to
 * provided interactions. */
export interface InteractiveModel<
	V extends ModelView,
	I extends ModelInteraction<T>,
	T = unknown
> extends Model<V> {
	/**Initiates a model interaction.
	 * @param interaction - Interaction to be executed.
	 * @returns A Promise for the completion of the interaction
	 * @async */
	interact(interaction: I): Promise<void>;
}

/**Encapsulates a singular model interaction/activity
 * which accordingly mutates the {@link Model}'s {@link ModelView}. */
export type ModelInteraction<T, I extends object | null = object | null> = {
	/**The kind of interaction. */
	readonly type: T;
	/**The interaction's corresponding input data, if any. */
	readonly input: I;
};
