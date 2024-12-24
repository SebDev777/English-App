import { AppState } from "../App.tsx"

export interface AppOptions {
  appState: AppState;
  setAppState: (state: AppState) => void;
}