import { AppState } from "../App.tsx"

export interface AppOptions {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

export interface ILevelData {
  completed: boolean,
  startedAt: number | null,
  completionTime: number | null,
  attempts: number
}

export type LevelsDataType = Array<ILevelData>

export interface LevelType {
  levelOptions: string[],
  dialog: string,
  title: string,
  difficulty: string
}

export interface LevelOptions {
  text: string,
  selected: boolean,
  selectedAt: number
}