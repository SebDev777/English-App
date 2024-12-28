import React, { useEffect, useState } from "react"

import { getPlayerLevel } from "../lib/levels.index.ts"

import { LevelType } from "../types/AppTypes.tsx"
import "./styles/LevelSelection.css"
import Confetti from 'react-confetti-boom';


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
      // Delay the scroll to ensure the DOM is fully updated (e.g., content rendering after state change)
      const timeout = setTimeout(() => {
        const currentElement = document.querySelector('.current');
        
        if (currentElement) {
          currentElement.scrollIntoView({
            behavior: 'smooth', // Smooth scrolling
            block: 'center'     // Center the element vertically in the viewport
          })
        }
      }, 0)
      return () => clearTimeout(timeout);
    }, [])

    useEffect(() => {
        const playerLevel = getPlayerLevel()
        setPlayerLevel(playerLevel)
    }, [])

    return (
        levels.map((item, index) => {
            const {difficulty, title} = item
            const difficulty_className = `${difficulty}-lvl`
            
            const current_className = index === playerLevel ? "current" : ""

            const completed_className = current_className === "current" ? "" : playerLevel > index ? "completed" : "not-completed"

            const className = `${difficulty_className} ${completed_className} ${current_className}`

            const mx = Math.floor(Math.sin(index) * 50)
            return (
              <article key={index}
                className={className} 
                style={{
                  animationDelay: `${index * 0.1}s`,
                  marginLeft: `${mx}vw`,
                  animation: index === playerLevel ? "level-unlocked 4s infinite, movement ease-in 4s" : "movement ease-in 4s infinite"
                }}
                onClick={() => handleClick(index)}
              >
                <span>
                  <h3>{difficulty.toLowerCase()}</h3>
                </span>
                <h2>{title}</h2>
              </article>
            )
          })
    )
}