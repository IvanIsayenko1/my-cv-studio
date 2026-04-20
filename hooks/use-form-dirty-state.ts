import { useEffect } from "react";
import { useUnsavedChangesContext } from "@/lib/contexts/unsaved-changes-context";

export function useFormDirtyState(formId: string, isDirty: boolean) {
  const { registerFormDirty, registerFormClean } = useUnsavedChangesContext();

  useEffect(() => {
    if (isDirty) {
      registerFormDirty(formId);
    } else {
      registerFormClean(formId);
    }

    return () => {
      registerFormClean(formId);
    };
  }, [isDirty, formId, registerFormDirty, registerFormClean]);
}
