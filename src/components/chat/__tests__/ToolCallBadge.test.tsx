import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolCallLabel ---

test("str_replace_editor create returns Creating label", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create", path: "src/App.jsx" }))
    .toBe("Creating App.jsx");
});

test("str_replace_editor str_replace returns Editing label", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "src/components/Card.tsx" }))
    .toBe("Editing Card.tsx");
});

test("str_replace_editor insert returns Editing label", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "insert", path: "src/index.ts" }))
    .toBe("Editing index.ts");
});

test("str_replace_editor view returns Reading label", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "view", path: "src/utils.ts" }))
    .toBe("Reading utils.ts");
});

test("str_replace_editor undo_edit returns Undoing edit label", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "undo_edit", path: "src/App.tsx" }))
    .toBe("Undoing edit in App.tsx");
});

test("file_manager delete returns Deleting label", () => {
  expect(getToolCallLabel("file_manager", { command: "delete", path: "src/old/Component.jsx" }))
    .toBe("Deleting Component.jsx");
});

test("file_manager rename returns Renaming label", () => {
  expect(getToolCallLabel("file_manager", { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }))
    .toBe("Renaming Old.tsx to New.tsx");
});

test("unknown tool returns tool name as fallback", () => {
  expect(getToolCallLabel("some_other_tool", { command: "run" }))
    .toBe("some_other_tool");
});

test("path without directory returns filename directly", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create", path: "App.jsx" }))
    .toBe("Creating App.jsx");
});

// --- ToolCallBadge component ---

test("shows spinner when state is call", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "str_replace_editor", args: { command: "create", path: "App.jsx" }, state: "call" }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  // Spinner is an SVG with animate-spin
  const svg = document.querySelector("svg");
  expect(svg?.getAttribute("class")).toContain("animate-spin");
});

test("shows spinner when state is partial-call", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "str_replace_editor", args: { command: "str_replace", path: "Card.tsx" }, state: "partial-call" }}
    />
  );
  const svg = document.querySelector("svg");
  expect(svg?.getAttribute("class")).toContain("animate-spin");
});

test("shows green dot when state is result with result value", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "str_replace_editor", args: { command: "create", path: "App.jsx" }, state: "result", result: "ok" }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  const dot = document.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
});

test("shows spinner when state is result but result is null", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "str_replace_editor", args: { command: "create", path: "App.jsx" }, state: "result", result: null }}
    />
  );
  const svg = document.querySelector("svg");
  expect(svg?.getAttribute("class")).toContain("animate-spin");
});

test("renders user-friendly label for file_manager delete", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "file_manager", args: { command: "delete", path: "src/Unused.tsx" }, state: "call" }}
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

test("renders user-friendly label for file_manager rename", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "file_manager", args: { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }, state: "result", result: { success: true } }}
    />
  );
  expect(screen.getByText("Renaming Old.tsx to New.tsx")).toBeDefined();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolCallBadge
      tool={{ toolName: "mystery_tool", args: {}, state: "call" }}
    />
  );
  expect(screen.getByText("mystery_tool")).toBeDefined();
});
