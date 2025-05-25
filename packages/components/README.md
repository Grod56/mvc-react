# mvc-react/components

[![build](https://github.com/Grod56/mvc-react/actions/workflows/components-build.yml/badge.svg)](https://github.com/Grod56/mvc-react/actions/workflows/components-build.yml) [![coverage](https://raw.githubusercontent.com/Grod56/mvc-react/main/badges/packages/components/coverage-total.svg)](https://github.com/Grod56/mvc-react/actions/workflows/components-coverage.yml) [![npm](https://img.shields.io/npm/v/%40mvc-react%2Fcomponents)](https://www.npmjs.com/package/@mvc-react/components)

Framework for developing MVC-based React components. It is based on `@mvc-react/mvc` (see more [here](https://github.com/Grod56/mvc-react/tree/main/packages/mvc#readme)).

## Installation

```console
npm install --save @mvc-react/components
```

## Summary

This package allows you to utilize MVC-patterned components (`ModeledComponent`s). The components
take in a single prop `model` which models what the UI displays and how the user interacts with it. An additional `children` prop is available for container components (`ModeledContainerComponent`).

## Benefits

When properly implemented, this framework:

-   Makes your components intuitive
-   Allows for greater view flexibility
-   Naturally decouples core/functional component logic from the component view logic,
    making it simpler to test
-   Confers the benefits of [other packages](#see-related) within the `@mvc-react` ecosystem when integrated with them.

💡 Tips:

-   Try to make sure your component's `Model` contains _all_ the properties and functionality essential to the component
-   Try to move _all_ `Model` logic away from your component and into the model so that there is a one-to-one correspondance between the `ModelView` and what is rendered on your component; and (if applicable) between the Model's `ModelInteraction`s and the events fired by the component

## Documentation

### `ModeledVoidComponent`

Encapsulates a functional react component which is patterned after a `Model`, and has no children.

#### Example 1:

```tsx
const Book: ModeledVoidComponent<BookModel> = function ({ model }) {
	const { title, author, cover } = model.modelView;

	return (
		<div className="book">
			<img className="book-cover" src={cover.src} alt={cover.alt} />
			<span className="book-title">{title}</span>
			<span className="author">{author}</span>
		</div>
	);
};
```

#### Example 2:

```tsx
const BookRepository = function({ model }) {
   const { bookModels } = model.modelView;
   const { interact } = model.interact;

   return (
      <>
         <div className='books-container'>
            <ComponentList // This component is available out-of-the-box
               model={newReadonlyModel({
                  Component: Book,
                  componentModels: bookModels,
               })}
            />
         </div>
         <button onClick={interact({"Refresh Models"})}>Refresh</button>
      </>
   );
} as ModeledVoidComponent<BookRepositoryModel>
```

### `ModeledContainerComponent`

Encapsulates a functional react component which is patterned after a `Model`, and has children.

#### Example 3:

```tsx
const SiteSection = function ({ model, children }) {
	const { sectionTitle } = model.modelView;

	return (
		<section className="site-section">
			<h2 className="section-title">{sectionTitle}</h2>
			{children}
		</section>
	);
} as ModeledContainerComponent<SiteSectionModel>;
```

## Utility components

The package also comes with a couple of general purpose `ModeledComponents` which fulfil common
tasks like listing and placeholdering.

### `ComponentList`

Component that maps a list of models to their respective components. (see [Example 2](#example-2)).

#### `ModelView` properties

-   `componentModels` - List of models, each to be mapped to a `Component`.
-   `Component` - The `ModeledComponent` each component model will be mapped to.

### `ComponentPlaceholder`

Component that renders an alternative component in place of a `ModeledComponent` whose model
is not yet defined.

#### `ModelView` properties

-   `placeholderedComponentModel` - Model of placeholdered component.
-   `PlaceholderedComponent` - Component the placeholdered model will be mapped to when defined.
-   `PlaceholderComponent` - Placeholder component

#### Example 4:

```tsx
const BookPlaceholder = function ({ model }) {
	const { bookModel } = model.modelView;

	return (
		<ComponentPlaceholder
			model={newReadonlyModel({
				placeholderedComponentModel: bookModel,
				PlaceholderedComponent: Book,
				PlaceholderComponent: () => <BookSkeleton />,
			})}
		/>
	);
} as ModeledVoidComponent<BookModel>;
```

### `ConditionalComponent`

Component that renders different components depending on a provided condition.

#### `ModelView` properties

-   `condition` - Value that determines which component to render.
-   `components` - A map pairing a condition to its respective component.
-   `FallbackComponent` - Component to render when provided condition does not map to
    any component, or is invalid.

#### Example 5:

```tsx
const BookRepository = function({ model }) {
   const { bookModels, condition } = model.modelView;
   const { interact } = model.interact;

   const SuccessComponent = () => (
      <div className='books-container'>
         <ComponentList
            model={
               modelView: {
                  componentModels: bookModels,
                  Component: Book,
               }
            }
        />
      </div>
   );

   return (
      <>
         <ConditionalComponent
            model={newReadonlyModel({
               condition: condition,
               components: new Map([
                  ["success", SuccessComponent],
                  ["pending", () => <PendingSkeleton />],
                  ["failed", () => <FailedSkeleton />]
               ]),
               FallbackComponent: () => <></>,
            })}
         />
         <button onClick={interact({"Refresh Models"})}>Refresh</button>
      </>
  );
} as ModeledVoidComponent<BookRepositoryModel>
```

## See Related

-   [@mvc-react/mvc](https://github.com/Grod56/mvc-react/tree/main/packages/mvc#readme)
-   [@mvc-react/stateful](https://github.com/Grod56/mvc-react/tree/main/packages/stateful#readme)
