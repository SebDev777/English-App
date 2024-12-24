import React, { useState, useEffect } from "react"

import LevelSelection from "./layout/LevelSelection.tsx"
import LevelLayout from "./layout/LevelLayout.tsx"
import {getPlayerLevel, levels} from "./lib/levels.index.ts"

export type AppState = "LOADING" | "ERROR" | "SUCCESS" | "PLAYING" | "LEVEL_SELECTION";

export const APP_STATES = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  PLAYING: "PLAYING",
  LEVEL_SELECTION: "LEVEL_SELECTION",
} as const;

function App() {
  const [ appState, setAppState ] = useState<AppState>(APP_STATES.LEVEL_SELECTION)
  const [ levelSelected, setLevelSelected ] = useState<number | null>(null)

  const [anim, setAnim] = useState("none")
  useEffect(() => {
    setAnim("appear 1s 1")
  }, [])

  useEffect(() => {
      const levelsData = levels.map((_, index) => {
        return {
          completed: false,
          startedAt: null,
          completionTime: null,
          attemps: 1
        }
      })

      localStorage.setItem("levelsData", JSON.stringify(levelsData))
  }, [])

  function handleLevelSelection(level: number) {
    console.log("Trying to select level", level)
    if (!levels[level]) return alert("Level not found")
    const playerLevel = getPlayerLevel()
    if (playerLevel < level) return
    setAppState(APP_STATES.PLAYING)
    setLevelSelected(level)
    console.log("Level selected", level)
  }

  return (
    <>
      <header>
        {appState === APP_STATES.LEVEL_SELECTION && (
          <div className="header">
            <h1>Levels {`(${levels.length})`}</h1>
            <h1>Completed {`${getPlayerLevel()}`}</h1>
          </div>
        )}
      </header>
      <main style={{animation: anim}}>
        <section>
          {
            appState === APP_STATES.LEVEL_SELECTION ? (
              <LevelSelection 
                levels={levels} 
                handleLevelSelection={handleLevelSelection} 
              />
            ) : <LevelLayout 
                  level={levelSelected} 
                  appOptions={{appState, setAppState}}
                />
          }
        </section>
      </main>
    </>
  );
}

export default App
