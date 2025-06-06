# mvc-react/stateful

[![build](https://github.com/Grod56/mvc-react/actions/workflows/stateful-build.yml/badge.svg)](https://github.com/Grod56/mvc-react/actions/workflows/stateful-build.yml) [![coverage](https://raw.githubusercontent.com/Grod56/mvc-react/main/badges/packages/stateful/coverage-total.svg)](https://github.com/Grod56/mvc-react/actions/workflows/stateful-coverage.yml) [![npm](https://img.shields.io/npm/v/%40mvc-react%2Fstateful)](https://www.npmjs.com/package/@mvc-react/stateful)

Lean toolkit for 'stateful' MVC use cases in React. It is based on `@mvc-react/mvc` (see more [here](https://github.com/Grod56/mvc-react/tree/main/packages/mvc#readme)).

## Installation

```console
npm install --save @mvc-react/stateful
```

## Summary

This package allows you to utilize stateful `InteractiveModel`s in your React application. Statefulness, in this context, simply means that the model properties/functions persist between component renders.

The model's `modelView` is observable and only changes when altered by the model's `interact` method. This drastically simplifies state logic and management for React components and hooks which are based on this framework.

## Benefits

- Simplifies `InteractiveModel` state logic
- Is very lean (only depends on built-in React API)
- Is React-DOM agnostic (i.e. can be used with React Native, or any other DOM implementation)
- Confers the benefits of [other packages](#see-related) within the `@mvc-react` ecosystem when integrated with them.

## Documentation

### `StatifiableModel`

Represents a `Model` that can be transformed into a stateful `InteractiveModel`. It consists of an additional `ViewInteractionInterface` object whose function is similar to that of a Redux [reducer](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#writing-reducers).

### `ViewInteractionInterface`

The interface contains a single function, `produceModelView`, which accepts a `ModelInteraction` and returns a Promise for the new corresponding `ModelView`.

#### Example:

```ts
import { ViewInteractionInterface } from @mvc-react/stateful;

const interface: ViewInteractionInterface<
   CalculatorModelView,
   CalculatorInteraction
> = {
   produceModelView(interaction: CalculatorInteraction) {
      switch (interaction.type) {
         case "add": {
            const { x, y } = interaction.input!;
            return Promise.resolve({ display: x + y });
         }
         case "subtract": {
            const { x, y } = interaction.input!;
            return Promise.resolve({ display: x - y });
         }
         default:
            return Promise.reject("Unhandled interaction");
      }
   }
}
```

## API

### `useInitializedStatefulInteractiveModel`

Constructs stateful `InteractiveModel` with observable `modelView`, which is based on the provided `viewInteractionInterface` and is initialized with provided initialModelView.

### `useNewStatefulInteractiveModel`

Constructs stateful `InteractiveModel` with observable `modelView`, which is based on the provided `viewInteractionInterface`.

### `useTransformedStatefulInteractiveModel`

Transforms provided statifiable model into new stateful `InteractiveModel` with observable `modelView`.

## See Related

- [@mvc-react/mvc](https://github.com/Grod56/mvc-react/tree/main/packages/mvc#readme)
- [@mvc-react/components](https://github.com/Grod56/mvc-react/tree/main/packages/components#readme)
