import { calculateDependencies } from "./analyze";
import * as path from "path";
import * as fs from "fs";

describe("calculateDependencies", () => {
  it("should handle files with no dependencies", () => {
    const result = calculateDependencies("./examples/no-deps.js");

    expect(result.dependencyCount).toBe(0);
    expect(result.visited.size).toBe(1);
    expect(result.dependencyPaths).toEqual([]);
  });

  it("should count ESM import dependencies", () => {
    const result = calculateDependencies("./examples/simple-esm.js");

    expect(result.dependencyCount).toBe(3);
    expect(result.visited.size).toBe(2);
    expect(result.dependencyPaths.length).toBe(3);
  });

  it("should count CommonJS require dependencies", () => {
    const result = calculateDependencies("./examples/simple.js");

    expect(result.dependencyCount).toBe(3);
    expect(result.visited.size).toBe(2);
    expect(result.dependencyPaths.length).toBe(3);
  });

  it.todo("should handle circular dependencies");

  it("should return 0 for non-existent files", () => {
    const result = calculateDependencies("nonexistent.ts");

    expect(result.dependencyCount).toBe(0);
    expect(result.visited.size).toBe(0);
    expect(result.dependencyPaths).toEqual([]);
  });
});
