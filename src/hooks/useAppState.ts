import { useEffect, useState } from "react";
import type { AppState } from "../types";
import { loadState, saveState } from "../store";
import { useColumnActions } from "./useColumnActions";
import { useTaskActions } from "./useTaskActions";

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return {
    state,
    ...useColumnActions(setState),
    ...useTaskActions(setState),
  };
}
