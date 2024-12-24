import React, { useState, useEffect } from "react"

import LevelSelection from "./layout/LevelSelection.tsx"
import LevelLayout from "./layout/LevelLayout.tsx"
import WelcomeScreen from "./layout/WelcomeScreen.tsx"
import {getPlayerLevel, levels, LevelsDataHandle} from "./lib/levels.index.ts"

export type AppState = "LOADING" | "ERROR" | "SUCCESS" | "PLAYING" | "LEVEL_SELECTION";

export const APP_STATES = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  PLAYING: "PLAYING",
  LEVEL_SELECTION: "LEVEL_SELECTION",
} as const;

const WELCOME_STATUS = {
    WAITING: "WAITING",
    LOADED: "LOADED"
}

function App() {
  const [ appState, setAppState ] = useState<AppState>(APP_STATES.LEVEL_SELECTION)
  const [ levelSelected, setLevelSelected ] = useState<number | null>(null)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [ welcomeStatus, setWelcomeStatus ] = useState(WELCOME_STATUS.WAITING)

  useEffect(() => {
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setWelcomeStatus(WELCOME_STATUS.LOADED)
        const t2 = setTimeout(() => {
          setShowWelcomeScreen(false);
        }, 2000)

        return () => clearTimeout(t2)
      }, 5000); // Show welcome screen for 10 seconds

      return () => clearTimeout(timer);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
      const InitialData = LevelsDataHandle.get()
      if (InitialData) return
      const levelsData = levels.map(() => {
        return {
          completed: false,
          startedAt: null,
          completionTime: null,
          attempts: 1
        }
      })

      LevelsDataHandle.set(levelsData) 
  }, [])

  function handleLevelSelection(level: number) {
    if (!levels[level]) {
      return alert("Level not found, the app may be broken")
    }
    const playerLevel = getPlayerLevel()
    if (playerLevel < level) return
    setAppState(APP_STATES.PLAYING)
    setLevelSelected(level)
  }

  return (
    <>
    {showWelcomeScreen ? (
      <WelcomeScreen status={welcomeStatus} />
    ) : (
        <>
          <header>
            {appState === APP_STATES.LEVEL_SELECTION && (
              <div className="header">
                <h1>Levels {`(${levels.length})`}</h1>
                <h1>{`${getPlayerLevel()}`} levels completed.</h1>
              </div>
            )}
          </header>
          <main>       
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
      )
    }
    </>
  );
}

export default App
