"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Bold, Italic, List, ListOrdered } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { Button } from "./button";

const _controls = ["bold", "italic", "unordered", "ordered"] as const;
type RichTextControl = (typeof _controls)[number];
type RichTextMode = "full" | "list-only";
type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeightClassName?: string;
  disabledControls?: RichTextControl[];
  mode?: RichTextMode;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
  disabled = false,
  minHeightClassName = "min-h-40",
  disabledControls = [],
  mode = "full",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnorderedList, setIsUnorderedList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);

  const disabledControlsSet = useMemo(
    () => new Set<RichTextControl>(disabledControls),
    [disabledControls]
  );

  const toolbarButtons = useMemo(() => {
    const allButtons = [
      {
        key: "bold" as const,
        label: "Bold",
        icon: Bold,
        active: isBold,
        onClick: () => document.execCommand("bold"),
        disabled: disabledControlsSet.has("bold"),
      },
      {
        key: "italic" as const,
        label: "Italic",
        icon: Italic,
        active: isItalic,
        onClick: () => document.execCommand("italic"),
        disabled: disabledControlsSet.has("italic"),
      },
      {
        key: "unordered" as const,
        label: "Bulleted List",
        icon: List,
        active: isUnorderedList,
        onClick: () => document.execCommand("insertUnorderedList"),
        disabled: disabledControlsSet.has("unordered"),
      },
      {
        key: "ordered" as const,
        label: "Numbered List",
        icon: ListOrdered,
        active: isOrderedList,
        onClick: () => document.execCommand("insertOrderedList"),
        disabled: disabledControlsSet.has("ordered"),
      },
    ];

    if (mode === "list-only") {
      return allButtons.filter(
        (button) => button.key === "unordered" || button.key === "ordered"
      );
    }

    return allButtons;
  }, [
    isBold,
    isItalic,
    isUnorderedList,
    isOrderedList,
    disabledControlsSet,
    mode,
  ]);

  const sanitizeOutputHtml = (html: string) => {
    if (mode !== "list-only") return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const allowedTags = new Set(["ul", "ol", "li", "br"]);

    const cleanNode = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent ?? "");
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();

      if (!allowedTags.has(tag)) {
        const fragment = document.createDocumentFragment();
        for (const child of Array.from(element.childNodes)) {
          const cleanedChild = cleanNode(child);
          if (cleanedChild) fragment.appendChild(cleanedChild);
        }
        return fragment;
      }

      const cleanElement = document.createElement(tag);
      for (const child of Array.from(element.childNodes)) {
        const cleanedChild = cleanNode(child);
        if (cleanedChild) cleanElement.appendChild(cleanedChild);
      }

      return cleanElement;
    };

    const wrapper = document.createElement("div");
    for (const child of Array.from(doc.body.childNodes)) {
      const cleaned = cleanNode(child);
      if (cleaned) wrapper.appendChild(cleaned);
    }

    return wrapper.innerHTML;
  };

  const refreshToolbarState = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnorderedList(document.queryCommandState("insertUnorderedList"));
    setIsOrderedList(document.queryCommandState("insertOrderedList"));
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      selectionRef.current = null;
      return;
    }

    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    if (!editor) return;

    if (editor.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selectionRef.current;
    if (!range) return;

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const placeCaretAtListItemStart = (listItem: HTMLLIElement) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(listItem);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
  };

  const ensureListOnlyContext = () => {
    if (disabled || mode !== "list-only") return;

    const editor = editorRef.current;
    if (!editor) return;

    const defaultListTag = disabledControlsSet.has("unordered") ? "ol" : "ul";
    const currentList = editor.querySelector("ul, ol");
    if (currentList) {
      const firstListItem = currentList.querySelector("li");
      if (!firstListItem) {
        const li = document.createElement("li");
        li.appendChild(document.createElement("br"));
        currentList.appendChild(li);
        placeCaretAtListItemStart(li);
      }
      return;
    }

    const plainText = editor.textContent?.trim() ?? "";
    const lines = plainText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const list = document.createElement(defaultListTag);
    if (lines.length === 0) {
      const li = document.createElement("li");
      li.appendChild(document.createElement("br"));
      list.appendChild(li);
    } else {
      lines.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        list.appendChild(li);
      });
    }

    editor.innerHTML = "";
    editor.appendChild(list);

    const firstListItem = list.querySelector("li");
    if (firstListItem) {
      placeCaretAtListItemStart(firstListItem);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentSanitized = sanitizeOutputHtml(
      editor.innerHTML.replace(/\u200B/g, "")
    );
    if (currentSanitized === value) return;

    // Avoid resetting caret while the user types unless content truly diverges.
    if (document.activeElement === editor) return;

    editor.innerHTML = value || "";
  }, [value, mode]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const editor = editorRef.current;
      if (!editor || !editor.contains(range.commonAncestorContainer)) return;

      saveSelection();
      refreshToolbarState();
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;

    ensureListOnlyContext();

    const sanitizedHtml = sanitizeOutputHtml(
      editor.innerHTML.replace(/\u200B/g, "")
    );
    const html =
      sanitizedHtml === "<br>" || sanitizedHtml === "<p><br></p>"
        ? ""
        : sanitizedHtml;
    onChange(html);
    refreshToolbarState();
  };

  const runCommand = (command: () => void) => {
    if (disabled) return;
    editorRef.current?.focus();
    restoreSelection();
    command();
    emitChange();
  };

  const ensureDefaultListContext = () => {
    ensureListOnlyContext();
    refreshToolbarState();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-transparent bg-transparent",
        className
      )}
    >
      <div className="border-input bg-input/50 flex items-center gap-1 overflow-x-auto border-b p-1.5 sm:flex-wrap sm:p-2">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.key}
              type="button"
              size="icon"
              variant={button.active ? "default" : "ghost"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(button.onClick)}
              disabled={disabled || button.disabled}
              aria-label={button.label}
              title={button.label}
              className="h-10 w-10 shrink-0 sm:h-8 sm:w-8"
            >
              <Icon className="size-4" />
            </Button>
          );
        })}
      </div>

      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onFocus={ensureDefaultListContext}
        onInput={emitChange}
        onKeyUp={() => {
          saveSelection();
          refreshToolbarState();
        }}
        onMouseUp={() => {
          saveSelection();
          refreshToolbarState();
        }}
        className={cn(
          minHeightClassName,
          "prose prose-sm dark:prose-invert bg-input/50 max-w-none px-3 py-2 text-base leading-6 outline-none sm:text-sm sm:leading-5",
          "[&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
          "empty:before:text-muted-foreground empty:before:pointer-events-none empty:before:content-[attr(data-placeholder)]",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
    </div>
  );
}
