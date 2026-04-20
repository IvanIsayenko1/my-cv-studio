"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface PendingNavigation {
  href: string;
  callback: () => void;
}

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  dirtyFormIds: Set<string>;
  registerFormDirty: (formId: string) => void;
  registerFormClean: (formId: string) => void;
  setDialogOpen: (open: boolean) => void;
  isDialogOpen: boolean;
  pendingNavigation: PendingNavigation | null;
  setPendingNavigation: (navigation: PendingNavigation | null) => void;
  confirmNavigation: () => void;
}

const UnsavedChangesContext = createContext<
  UnsavedChangesContextType | undefined
>(undefined);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dirtyFormIds, setDirtyFormIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);

  const hasUnsavedChanges = dirtyFormIds.size > 0;

  const registerFormDirty = useCallback((formId: string) => {
    setDirtyFormIds((prev) => new Set(prev).add(formId));
  }, []);

  const registerFormClean = useCallback((formId: string) => {
    setDirtyFormIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(formId);
      return newSet;
    });
  }, []);

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      setDialogOpen(false);
      pendingNavigation.callback();
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  // Handle beforeunload event following Vercel's recommendation
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <UnsavedChangesContext
      value={{
        hasUnsavedChanges,
        dirtyFormIds,
        registerFormDirty,
        registerFormClean,
        setDialogOpen,
        isDialogOpen,
        pendingNavigation,
        setPendingNavigation,
        confirmNavigation,
      }}
    >
      {children}
    </UnsavedChangesContext>
  );
}

export function useUnsavedChangesContext() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error(
      "useUnsavedChangesContext must be used within UnsavedChangesProvider"
    );
  }
  return context;
}
