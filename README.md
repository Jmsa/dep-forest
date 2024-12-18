# Dep-Forest 🌲 🌲 🌲

`dep-forest`, aka "dependency-forest", is a tool for analyzing and visualizing the module dependencies in your JavaScript or TypeScript projects. Whether you're using ES Modules (`import`) or CommonJS (`require`), `dep-forest` helps you count and track how many dependencies your code relies on, including their nested dependencies.

Its name comes from the fact that we often think of file dependencies as a tree, or in some cases a forest. As the count of dependencies grows, so does the forest 🌲 🌲 🌲 and in many cases we want to know how many trees we're looking at. This is especially true if we start to see performance issues and want to know which files are most heavily relied on or pulled in as a part of an unexpected dependency tree.

> *Note: there are lots of other tools out there that provide similar functionality, but I wanted a lightweight tool that was easy to understand and extend. In the future additional features like visualizations or eslint-plugin integration are likely to be added - though there are no currently planned milestones.*

## Features

- **ESM & CommonJS Support**: Tracks dependencies for both `import` and `require` statements.
- **Recursive Dependency Counting**: Calculates the number of direct and indirect dependencies.
- **TypeScript Support**: Works seamlessly with TypeScript files (`.ts`, `.tsx`).
- **File System Integration**: Resolves local file imports and `node_modules` dependencies.
- **Customizable**: Easily extendable to customize how dependencies are handled.

## Installation

You can install the package via npm or yarn:

| NPM | Yarn |
| --- | ---- |
| `npm install --save-dev dep-forest` | `yarn add -D dep-forest` |

## Usage

### CLI Usage

`dep-forest` comes with a command-line interface that allows you to analyze your project files.

```bash
yarn dep-forest <entry-file>
```

For example when run against the examples in this repo:

```bash
yarn dep-forest ./examples/simple.js 
[dep-forest] Total dependencies for /dep-forest/examples/simple.js: 3
[dep-forest] >>> visited files: Set(2) {
  '/dep-forest/examples/simple.js',
  '/dep-forest/examples/simpleUtility.js'
}
[dep-forest] >>> dependencies: [
  'fs',
  'path',
  '/dep-forest/examples/simpleUtility.js'
]

```

As you can see this prints out a few things:

- total count of dependencies
- a list of files that were visited
- a list of dependencies

## Programmatic Usage

You can also use dep-forest programmatically in your own scripts:

```javascript
const { calculateDependencies } = require('dep-forest');

const filePath = './examples/simple.js'; // Path to your entry file
const { dependencyCount, visited, dependencyPaths } = calculateDependencies(filePath);

console.log(`Total dependencies for ${filePath}: ${dependencyCount}`);
```

## Supported File Types

- JavaScript: .js, .mjs, .jsx
- TypeScript: .ts, .tsx

## Example Files

Example files can be found in the [example](./example) directory. These will be added on to from time to time to showcase new features or bug fixes and are used for testing.

## Contributing

Contributions welcome! Feel free to fork the repo, make changes, and submit a pull request. For larger changes, please open an issue first to discuss what you would like to change. Chances are it's all good - but it's always best to discuss before you put in the effort to implement something.
