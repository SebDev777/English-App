import React, { useEffect, useState } from "react"

import { getPlayerLevel } from "../lib/levels.index.ts"

import { LevelType } from "../types/AppTypes.tsx"

interface ComponentProps {
  levels: LevelType[],
  handleLevelSelection: (level: number) => void;
}

export default function LevelSelection({levels, handleLevelSelection} : ComponentProps) {
    const [ playerLevel, setPlayerLevel ] = useState<number>(0)

    function handleClick(index: number) {
        handleLevelSelection(index)
    }

    useEffect(() => {
        const playerLevel = getPlayerLevel()
        setPlayerLevel(playerLevel)
        console.log("rendered")
    }, [])

    return (
        levels.map((item, index) => {
            const {difficulty, title} = item
            const difficulty_className = `${difficulty}-lvl`
            
            const current_className = index === playerLevel ? "current" : ""

            const completed_className = current_className === "current" ? "" : playerLevel > index ? "completed" : "not-completed"

            const className = `${difficulty_className} ${completed_className} ${current_className}`

            return (
              <article key={index}
                className={className} style={{
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => handleClick(index)}
              >
                <h2>{title}</h2>
                <span>
                  <h3>{difficulty.toLowerCase()}</h3>
                </span>
              </article>
            )
          })
    )
}