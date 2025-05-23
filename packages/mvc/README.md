# mvc-react/mvc

[![build](https://github.com/Grod56/mvc-react/actions/workflows/mvc-build.yml/badge.svg)](https://github.com/Grod56/mvc-react/actions/workflows/mvc-build.yml) [![coverage](/badges/packages/mvc/coverage-total.svg)](https://github.com/Grod56/mvc-react/actions/workflows/mvc-coverage.yml)

Toolkit for defining MVC applications in Typescript.

## Installation

```console
npm install --save-dev @mvc-react/mvc
```

## Documentation

### `Model`

The `Model` type encapsulates the essence of any item that can be viewed or interacted with. It represents the item's archetype, and generally consists of a `ModelView` object—which is where the model's properties are articulated.

#### Example 1:

```ts
import { Model } from @mvc-react/mvc;

// Our custom ModelView
interface BookView {
    title: string;
    author: string;
    isbn: string;
}

// Our custom Model definition
type BookModel = Model<BookView>;

const book: BookModel = {
    modelView: {
        title: "Screwtape Letters",
        author: "C.S. Lewis",
        isbn: "XXXX-XXXXX-XXXXX"
    }
}
```

### `ReadonlyModel`

The `ReadonlyModel` type represents a `Model` with an immutable `modelView`.

### `InteractiveModel`

The `InteractiveModel` type represents a `Model` whose `modelView` changes according to specified model 'interactions'. It consists of an additional `interact` function, which takes a single `ModelInteraction` object as an argument and mutates the model's `modelView` accordingly.

A `ModelInteraction` object has two properties: `type`—which specifies the type of interaction to be executed; and an optional `input` object which encapsulates the interaction's input data if there is any.

#### Example 2:

```ts
import { InteractiveModel, Model, ModelInteraction } from @mvc-react/mvc;

// Our custom ModelView definition
interface CalculatorView {
   display: number;
}

// The interactions our model will handle
type CalculatorInteraction = (
   ModelInteraction<"add", {x: number, y: number}> |
   ModelInteraction<"subtract", {x: number, y: number}>
)

// Our custom Model definition
type CalculatorModel = InteractiveModel<
   CalculatorView,
   CalculatorInteraction
>;

// Implemented
const calculator: CalculatorModel = {
    modelView: {
       display: 0,
    },
    interact(interaction: CalculatorInteraction) {
	switch (interaction.type) {
	   case "add": {
		 const { x, y } = interaction.input!;
		   this.modelView = { display: x + y };
		   break;
	   }
	   case "subtract": {
		 const { x, y } = interaction.input!;
		   this.modelView = { display: x - y };
		   break;
		 }
	   }
	}
}
```

```ts
// Result
calculator.interact({ type: "add", input: { x: 2, y: 3 } });
console.log(calculator.modelView); // { display: 5 }
```

### `newReadonlyModel()`

Convenience function for constructing a new `ReadonlyModel`

## See Related

-   [@mvc-react/stateful](https://github.com/Grod56/mvc-react/tree/main/packages/stateful#readme)
-   [@mvc-react/components](https://github.com/Grod56/mvc-react/tree/main/packages/components#readme)
