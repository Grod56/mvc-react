import type { Model, ModelView, ReadonlyModel } from "@mvc-react/mvc";
import type { CSSProperties, JSX, Ref } from "react";
import React from "react";

// Meta
//__________________________________________________________________________________________

/**Encapsulates a functional React component which is patterned
 * after a {@link Model}. */
export type ModeledComponent<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = {
	/**
	 * @param {Object} props
	 */
	({
		model,
		children,
	}: {
		/**
		 *  @property The {@link Model} the component is patterned after
		 */
		model: M;
		/**
		 *  @property The component's children
		 */
		children?: React.ReactNode;
	}): JSX.Element | Promise<JSX.Element>;
};

/**Encapsulates a functional React component which is patterned
 * after a {@link Model}, and has no children. */
export type ModeledVoidComponent<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = ({
	model,
}: Omit<Parameters<ModeledComponent<M, V>>[0], "children">) => ReturnType<
	ModeledComponent<M, V>
>;

/**Encapsulates a functional React component which is patterned
 * after a {@link Model}, and has children. */
export type ModeledContainerComponent<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = {
	({
		model,
		children,
	}: Required<Parameters<ModeledComponent<M, V>>[0]>): ReturnType<
		ModeledComponent<M, V>
	>;
};

/**Encapsulates a functional React component which is patterned
 * after a {@link Model}, and is stylable */
export type StyledModeledComponent<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = {
	({
		model,
		children,
		className,
		style,
	}: { className?: string; style?: CSSProperties } & Parameters<
		ModeledComponent<M, V>
	>[0]): ReturnType<ModeledComponent<M, V>>;
};

/**Encapsulates a functional React component which is patterned
 * after a {@link Model}, and is manipulable with a ref. */
export type ModeledComponentWithRef<
	M extends Model<V>,
	V extends ModelView = ModelView,
	T = unknown,
> = {
	({
		model,
		children,
		ref,
	}: { ref: Ref<T> } & Parameters<ModeledComponent<M, V>>[0]): ReturnType<
		ModeledComponent<M, V>
	>;
};

export type GeneralComponent = () => JSX.Element;

// Components
//__________________________________________________________________________________________

// ComponentList ---------------------------------------------------------------------------

export type ComponentListModelView<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = {
	/**List of models, each to be mapped to a `Component`.*/
	componentModels: M[];

	/**The {@link ModeledComponent} each component model will be mapped to. */
	Component: ModeledVoidComponent<M>;
};

/**Encapsulates a component that unravels a list of {@link Model}s
 * into their respective {@link ModeledComponent}s.*/
export type ComponentListModel<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = ReadonlyModel<ComponentListModelView<M>>;

/**Component that maps a list of models to their respective components. */
export function ComponentList<
	M extends Model<V>,
	V extends ModelView = ModelView,
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
	V extends ModelView = ModelView,
> = M | undefined;

export type ComponentPlaceholderModelView<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = {
	/**Model of placeholdered component */
	placeholderedComponentModel: PlaceholderedComponentModel<M>;

	/**Component the placeholdered model will be mapped to when defined */
	PlaceholderedComponent: ModeledVoidComponent<M>;

	/**Placeholder component */
	PlaceholderComponent: GeneralComponent;
};

/**Encapsulates a component that renders an alternative component in place
 * of a {@link ModeledComponent} whose model is not yet defined.
 */
export type ComponentPlaceholderModel<
	M extends Model<V>,
	V extends ModelView = ModelView,
> = ReadonlyModel<ComponentPlaceholderModelView<M>>;

/**
 * Component that renders an alternative component in place
 * of a {@link ModeledComponent} whose model is not yet defined.
 */
export function ComponentPlaceholder<
	M extends Model<V>,
	V extends ModelView = ModelView,
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

export type ConditionalComponentModelView<C> = {
	/**Value that determines which component to render. */
	condition: C;

	/**A map pairing a condition to its respective component. */
	components: Map<C, GeneralComponent>;

	/**Component to render when provided condition
	 * does not map to any component, or is invalid.
	 */
	FallbackComponent: GeneralComponent;
};

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
	const { condition, components, FallbackComponent } = model.modelView;
	return (
		<>
			{components.get(condition) ? (
				components.get(condition)!()
			) : (
				<FallbackComponent />
			)}
		</>
	);
}

// -----------------------------------------------------------------------------------------
