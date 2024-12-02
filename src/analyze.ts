const path = require("path");
const fs = require("fs");
const { parse } = require("@babel/parser");

const log = (...args: any[]) => {
  const chalk = require("chalk");
  console.log(chalk.green("[dep-forest]"), ...args);
};

/**
 * Recursively calculates dependencies for a file.
 * @param {string} filePath - The file to analyze.
 * @param {Set<string>} visited - Tracks visited files to avoid circular dependencies.
 * @returns {number} The total dependency count for the given file.
 */
export function calculateDependencies(
  filePath: string,
  visited: Set<string> = new Set(),
  dependencyPaths: string[] = []
) {
  if (visited.has(filePath) || !fs.existsSync(filePath)) {
    return { dependencyCount: 0, visited, dependencyPaths };
  }

  visited.add(filePath);

  const code = fs.readFileSync(filePath, "utf-8");
  const ast = parse(code, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx"],
  });

  let dependencyCount = 0;

  ast.program.body.forEach((node: any) => {
    // Handle ESM imports

    if (node.type === "ImportDeclaration") {
      const importPath = node.source.value;
      const resolvedPath = resolveModulePath(importPath, filePath);

      if (resolvedPath) {
        dependencyCount +=
          1 + calculateDependencies(resolvedPath, visited).dependencyCount;
        dependencyPaths.push(resolvedPath);
      }
    } else if (node.type === "VariableDeclaration") {
      // Handle CommonJS require in variable declarations
      // TODO: type this
      node.declarations.forEach((declarator: any) => {
        if (
          declarator.init &&
          declarator.init.type === "CallExpression" &&
          declarator.init.callee.type === "Identifier" &&
          declarator.init.callee.name === "require"
        ) {
          const arg = declarator.init.arguments[0];
          if (arg && arg.type === "StringLiteral") {
            const requirePath = arg.value;
            const resolvedPath = resolveModulePath(requirePath, filePath);

            if (resolvedPath) {
              dependencyCount +=
                1 +
                calculateDependencies(resolvedPath, visited).dependencyCount;
              dependencyPaths.push(resolvedPath);
            }
          }
        }
      });
    } else if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.type === "Identifier" &&
      node.expression.callee.name === "require"
    ) {
      // Handle standalone ExpressionStatement calls
      const arg = node.expression.arguments[0];
      if (arg && arg.type === "StringLiteral") {
        const requirePath = arg.value;
        const resolvedPath = resolveModulePath(requirePath, filePath);

        if (resolvedPath) {
          dependencyCount +=
            1 + calculateDependencies(resolvedPath, visited).dependencyCount;
          dependencyPaths.push(resolvedPath);
        }
      }
    }
  });

  return { dependencyCount, visited, dependencyPaths };
}

/**
 * Resolves module paths relative to the current file or from `node_modules`.
 * @param {string} importPath - The path from the import statement.
 * @param {string} currentFilePath - The file currently being analyzed.
 * @returns {string|null} The resolved file path or null if not resolvable.
 */
function resolveModulePath(importPath: string, currentFilePath: string) {
  if (importPath.startsWith(".")) {
    const basePath = path.dirname(currentFilePath);
    const extensions = [".js", ".ts", ".jsx", ".tsx"];

    for (const ext of extensions) {
      const resolvedPath = path.resolve(basePath, `${importPath}${ext}`);
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
      }
    }
    return null;
  }

  // Resolve from `node_modules`
  try {
    return require.resolve(importPath, {
      paths: [path.dirname(currentFilePath)],
    });
  } catch {
    return null;
  }
}

// CLI Integration
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node analyze-dependencies.js <entry-file>");
    process.exit(1);
  }

  const entryFilePath = path.resolve(args[0]);
  if (!fs.existsSync(entryFilePath)) {
    console.error(`File not found: ${entryFilePath}`);
    process.exit(1);
  }

  const { dependencyCount, visited, dependencyPaths } =
    calculateDependencies(entryFilePath);
  log(`Total dependencies for ${entryFilePath}: ${dependencyCount}`);
  log(">>>", "visited files:", visited);
  log(">>>", "dependencies:", dependencyPaths);
}

module.exports = { calculateDependencies };
