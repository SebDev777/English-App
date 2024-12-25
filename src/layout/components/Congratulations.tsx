import React, { useEffect, useState } from "react"
import "./styles/Congratulations.css"

import Confetti from 'react-confetti-boom';

const formatSecondsToMinutes = (seconds: number) => {
    console.log(seconds)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}m ${remainingSeconds}s`
}

export default function Congratulations({level, resetLevel}) {
    const [stats, setStats] = useState({
        time: 0,
        attempts: 0
    })

    
    const [anim, setAnim] = useState("none")

    useEffect(() => {
        setAnim("appear 1s 1")
    })

    useEffect(() => {
        const levelsData = localStorage.getItem("levelsData")
        if (!levelsData) return
        let levelsDataParsed = JSON.parse(levelsData)
        const levelData = levelsDataParsed[level]
        const completionTime = levelData.completionTime
        const attempts = levelData.attempts

        setStats({
            time: completionTime, 
            attempts: attempts
        })
    }, [])

    return ( 
        <div className="congratulations" style={{animation: anim}}>
            <Confetti 
                mode="boom"
                shapeSize={25}
                y={0.35}
                spreadDeg={180}
                particleCount={50}
                colors={["#FFD700", "#fafafafa", "#67e9ac"]}
            />
            <img className="robot-logo" src="https://icones.pro/wp-content/uploads/2022/10/icone-robot-bleu.png" />
            <div className="congrats-txt">
                {"Congratulations!".split('').map((char, index) => (
                    <span style={{
                        animationDelay: `${index/50}s`
                    }} key={index}>{char}</span>
                ))}
            </div>
            <h2>You have completed the level {level}!!</h2>
            {
                stats && (
                    <div className="stats">
                        <h3>Stats:</h3>
                        <p>Time: {formatSecondsToMinutes(stats.time)}</p>
                        <p>Attempts: {stats.attempts}</p>
                    </div>
                )
            }

            <div className="level-reset">
                <button onClick={resetLevel}>Retry Level</button>
            </div>
        </div>
    )
}