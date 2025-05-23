import { Model, ModelView, ReadonlyModel } from "@mvc-react/mvc";
import React, { JSX } from "react";
// Meta
//__________________________________________________________________________________________

/**Encapsulates a functional react component which is patterned
 * after a {@link Model}, and has no children. */
export interface ModeledVoidComponent<
	M extends Model<V>,
	V extends ModelView = ModelView
> {
	/**
	 * @param {Object} props
	 * @param {M} props.model - The Model the component is patterned after
	 */
	({ model }: { model: M }): JSX.Element;
}

/**Encapsulates a functional react component which is patterned
 * after a {@link Model}, and has children. */
export interface ModeledContainerComponent<
	M extends Model<V>,
	V extends ModelView = ModelView
> {
	/**
	 * @param {Object} props
	 * @param {M} props.model - The Model the component is patterned after
	 * @param children - The component's children */
	({ model, children }: { model: M; children: React.ReactNode }): JSX.Element;
}

/**Encapsulates a functional react component which is patterned
 * after a {@link Model}. */
export type ModeledComponent<
	M extends Model<V>,
	V extends ModelView = ModelView
> = ModeledVoidComponent<M> | ModeledContainerComponent<M>;

export type GeneralComponent = () => JSX.Element;

// Components
//__________________________________________________________________________________________

// ComponentList ---------------------------------------------------------------------------

export interface ComponentListModelView<
	M extends Model<V>,
	V extends ModelView = ModelView
> {
	/**List of models, each to be mapped to a `Component`.*/
	componentModels: M[];

	/**The {@link ModeledComponent} each component model will be mapped to. */
	Component: ModeledVoidComponent<M>;
}

/**Encapsulates a component that unravels a list of {@link Model}s
 * into their respective {@link ModeledComponent}s.*/
export type ComponentListModel<
	M extends Model<V>,
	V extends ModelView = ModelView
> = ReadonlyModel<ComponentListModelView<M>>;

/**Component that maps a list of models to their respective components. */
export function ComponentList<
	M extends Model<V>,
	V extends ModelView = ModelView
>({ model }: { model: ComponentListModel<M> }) {
	const { componentModels, Component } = model.modelView;
	return (
		<>
			{componentModels.map((componentModel, index) => (
				<Component key={index} model={componentModel} />
			))}
		</>
	);
}

// ComponentPlaceholder --------------------------------------------------------------------

export type PlaceholderedComponentModel<
	M extends Model<V>,
	V extends ModelView = ModelView
> = M | undefined;

export interface ComponentPlaceholderModelView<
	M extends Model<V>,
	V extends ModelView = ModelView
> {
	/**Model of placeholdered component */
	placeholderedComponentModel: PlaceholderedComponentModel<M>;

	/**Component the placeholdered model will be mapped to when defined */
	PlaceholderedComponent: ModeledVoidComponent<M>;

	/**Placeholder component */
	PlaceholderComponent: GeneralComponent;
}

/**Encapsulates a component that renders an alternative component in place
 * of a {@link ModeledComponent} whose model is not yet defined.
 */
export type ComponentPlaceholderModel<
	M extends Model<V>,
	V extends ModelView = ModelView
> = ReadonlyModel<ComponentPlaceholderModelView<M>>;

/**
 * Component that renders an alternative component in place
 * of a {@link ModeledComponent} whose model is not yet defined.
 */
export function ComponentPlaceholder<
	M extends Model<V>,
	V extends ModelView = ModelView
>({ model }: { model: ComponentPlaceholderModel<M> }) {
	const {
		placeholderedComponentModel,
		PlaceholderedComponent,
		PlaceholderComponent,
	} = model.modelView;
	return placeholderedComponentModel ? (
		<PlaceholderedComponent model={placeholderedComponentModel} />
	) : (
		// Can't figure out how coverage is missing this sometimes
		<PlaceholderComponent />
	);
}

// ConditionalComponent ------------------------------------------------------------------

export interface ConditionalComponentModelView<C> {
	/**Value that determines which component to render. */
	condition: C;

	/**A map pairing a condition to its respective component. */
	components: Map<C, GeneralComponent>;

	/**Component to render when provided condition
	 * does not map to any component, or is invalid.
	 */
	FallBackComponent: GeneralComponent;
}

/**Encapsulates a component that renders different components depending
 * on a provided condition.
 */
export type ConditionalComponentModel<C> = ReadonlyModel<
	ConditionalComponentModelView<C>
>;

/**Component that renders different components depending on a
 * provided condition. */
export function ConditionalComponent<C>({
	model,
}: {
	model: ConditionalComponentModel<C>;
}) {
	const { condition, components, FallBackComponent } = model.modelView;
	return (
		<>
			{components.get(condition) ? (
				components.get(condition)!()
			) : (
				<FallBackComponent />
			)}
		</>
	);
}

// -----------------------------------------------------------------------------------------
