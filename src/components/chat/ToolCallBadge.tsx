"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
  result?: unknown;
}

function basename(path: string): string {
  return path.split("/").pop() || path;
}

export function getToolCallLabel(
  toolName: string,
  args: Record<string, unknown>
): string {
  const path = typeof args.path === "string" ? args.path : "";
  const filename = basename(path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "delete":
        return `Deleting ${filename}`;
      case "rename": {
        const newPath = typeof args.new_path === "string" ? args.new_path : "";
        return `Renaming ${filename} to ${basename(newPath)}`;
      }
    }
  }

  return toolName;
}

interface ToolCallBadgeProps {
  tool: ToolInvocation;
}

export function ToolCallBadge({ tool }: ToolCallBadgeProps) {
  const isDone = tool.state === "result" && tool.result != null;
  const label = getToolCallLabel(tool.toolName, tool.args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
