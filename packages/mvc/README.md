# mvc-react/mvc

[![build](https://github.com/Grod56/mvc-react/actions/workflows/mvc-build.yml/badge.svg)](https://github.com/Grod56/mvc-react/actions/workflows/mvc-build.yml) [![coverage](https://raw.githubusercontent.com/Grod56/mvc-react/main/badges/packages/mvc/coverage-total.svg)](https://github.com/Grod56/mvc-react/actions/workflows/mvc-coverage.yml) [![npm](https://img.shields.io/npm/v/%40mvc-react%2Fmvc)](https://www.npmjs.com/package/@mvc-react/mvc)

Toolkit for defining MVC applications in Typescript.

## Installation

```console
npm install --save-dev @mvc-react/mvc
```

## Benefits

When properly implemented, this framework:

-   Makes your item/unit/module intuitive and easy to understand
-   Naturally abstracts different aspects of your item, making it flexible and scalable
-   Makes the item drastically easier to test
-   Confers the benefits of [other packages](#see-related) within the `@mvc-react` ecosystem when integrated with them

## Documentation

### `Model`

The `Model` type encapsulates the essence of any item that can be viewed or interacted with, e.g. a book, a repository, a component, etc. It represents the item's archetype, that is, it defines the item's overall pattern and its properties. It generally consists of a `ModelView`—which is where the model's properties are articulated.

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

A `ModelInteraction` basically comes in two forms: as a simple `ModelInteraction` which has a single property, `type`—which specifies the type of interaction to be executed; or as an `InputModelInteraction` which, as aptly named, contains an additional `input` property which encapsulates the interaction's input data if there is any.

#### Example 2:

```ts
import { InteractiveModel, Model, InputModelInteraction } from @mvc-react/mvc;

// Our custom ModelView definition
interface CalculatorView {
   display: number;
}

// The interactions our model will handle
type CalculatorInteraction = (
   InputModelInteraction<"add", {x: number, y: number}> |
   InputModelInteraction<"subtract", {x: number, y: number}>
)

// Our custom Model definition
type CalculatorModel = InteractiveModel<
   CalculatorView,
   CalculatorInteraction
>;

// Implemented
class Calculator implements CalculatorModel {

   private _modelView: {
      display: 0,
   }
   get modelView() {
      return this._modelView;
   }
   interact(interaction: CalculatorInteraction) {
      switch (interaction.type) {
         case "add": {
            const { x, y } = interaction.input!;
            this._modelView = { display: x + y };
            break;
         }
         case "subtract": {
            const { x, y } = interaction.input!;
            this._modelView = { display: x - y };
            break;
         }
      }
	}
}
```

```ts
// Result
const calculator = new Calculator();
calculator.interact({ type: "add", input: { x: 2, y: 3 } });
console.log(calculator.modelView); // { display: 5 }
```

### `newReadonlyModel()`

Convenience function for constructing a new `ReadonlyModel`

## See Related

-   [@mvc-react/stateful](https://github.com/Grod56/mvc-react/tree/main/packages/stateful#readme)
-   [@mvc-react/components](https://github.com/Grod56/mvc-react/tree/main/packages/components#readme)
