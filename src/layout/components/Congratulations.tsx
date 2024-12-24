import React, { useEffect, useState } from "react"
import "./styles/Congratulations.css"

import Confetti from 'react-confetti-boom';

export default function Congratulations({level}) {
    const [stats, setStats] = useState({
        time: "0s",
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
        const attemps = levelData.attemps

        setStats({
            time: completionTime, 
            attemps: attemps
        })
    }, [])

    return ( 
        <div className="congratulations" style={{animation: anim}}>
            <Confetti 
                mode="fall"
                shapeSize={25}
                fadeOutHeight={1}
                colors={["#FFD700", "#fafafafa", "#67e9ac"]}
            />
            <img className="robot-logo" src="https://icones.pro/wp-content/uploads/2022/10/icone-robot-bleu.png" />
            <h1>Congratulations!</h1>
            <h2>You have completed the level</h2>
            {
                stats && (
                    <div className="stats">
                        <h3>Stats:</h3>
                        <p>Time: {stats.time}</p>
                        <p>Attempts: {stats.attemps}</p>
                    </div>
                )
            }
        </div>
    )
}