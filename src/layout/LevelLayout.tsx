import React, { useState, useEffect } from 'react';
import './styles/LevelLayout.css';

import { APP_STATES, AppState } from "../App.tsx";
import { AppOptions } from '../types/AppTypes';
import {levels, getPlayerLevel} from "../lib/levels.index.ts"

import Congratulations from './components/Congratulations.tsx';
import LevelLayoutContainer from './components/LevelLayoutContainer.tsx';

const GAME_STATUS = {
    SUCCESS: "SUCCESS",
    PLAYING: "PLAYING"
}

type GameStatus = "SUCCESS" | "PLAYING"

type LevelLayout = {
    level: number, 
    appOptions : AppOptions, 
}

export default function LevelLayout({level, appOptions} : LevelLayout) {
    const { setAppState } = appOptions
    const [ selected, setSelected ] = useState<string[]>([])
    const [ levelOptions, setLevelOptions ] = useState<string[] | []>([])
    const [ dialog, setDialog ] = useState("")
    const [ totalSelected, setTotalSelected ] = useState<number>(0)
    const [ alertStatus, setAlertStatus ] = useState<string>("")
    const [ gameStatus, setGameStatus ] = useState<GameStatus>(GAME_STATUS.PLAYING)
    const [completed, setCompleted] = useState<boolean>(false)

    useEffect(() => {
        const levelsData = localStorage.getItem("levelsData")
        if (!levelsData) return
        let levelsDataParsed = JSON.parse(levelsData)
        if (levelsDataParsed[level].completed) return
        if (levelsDataParsed[level].startedAt) return
        /* Here we set the startedAt time */
        levelsDataParsed[level].startedAt = new Date().getTime()
        localStorage.setItem("levelsData", JSON.stringify(levelsDataParsed))
    }, [])

    useEffect(() => {
        const playerLevel = getPlayerLevel()
        if (playerLevel > level) {
            setCompleted(true)
        }
        const levelOptions = levels[level].levelOptions
        let newOptions : Array<Object> = []
        for (let option in levelOptions) {
            newOptions.push({
                text: levelOptions[option],
                selected: false,
                selectedAt: null
            })
        }

        setTotalSelected(0)
        setSelected([])
        setLevelOptions(newOptions)
        setDialog(levels[level].dialog)
        console.log(newOptions)
    }, [])

    function goBack() {
        setAppState(APP_STATES.LEVEL_SELECTION)
    }

    function reset() {
        setSelected([])
        setTotalSelected(0)
        setGameStatus(GAME_STATUS.PLAYING)
        setLevelOptions(levelOptions.map(option => {
            return {
                text: option.text,
                selected: false,
                selectedAt: null
            }
        }))
    }

    function handleOptionClick(index: number) {
        let newOptions = levelOptions.map((option, i) => {
            if (i === index && option.selected === false) {
                setAlertStatus("")
                setTotalSelected(totalSelected + 1)
                setSelected([...selected, option.text])
                return {
                    text: option.text,
                    selected: !option.selected,
                    selectedAt: totalSelected
                }
            } else {
                return option
            }
        })

        setLevelOptions(newOptions)
        console.log(newOptions)
    }

    function handleSubmit() {
        let allSelected = levelOptions.filter(option => option.selected === true)
        if (allSelected.length === levelOptions.length) {
            const Correct = levelOptions.filter(option => {
                return option.selectedAt === levelOptions.indexOf(option)
            })

            const levelsData = localStorage.getItem("levelsData")

            switch (Correct.length) {
                case levelOptions.length:
                    setGameStatus(GAME_STATUS.SUCCESS);
                
                    if (levelsData) {
                        let levelsDataParsed = JSON.parse(levelsData)
                        levelsDataParsed[level].completed = true
                        const completionTime = String((new Date().getTime() - levelsDataParsed[level].startedAt) / 1000) + "s"
                        levelsDataParsed[level].completionTime = completionTime
                        localStorage.setItem("levelsData", JSON.stringify(levelsDataParsed))
                    }
                    break
                default:
                    setAlertStatus("You got some answers wrong, try again!")
                    reset()

                    if (levelsData) {
                        let levelsDataParsed = JSON.parse(levelsData)
                        levelsDataParsed[level].attemps++
                        localStorage.setItem("levelsData", JSON.stringify(levelsDataParsed))                        
                    }
                    break
            }
        } else {
            setAlertStatus("You must select all options")
        }
    }

    return (
        <>
            <div className="level-header">
                <button onClick={goBack}>{`<`}</button>
                <h1>{`Level ${level}.`}</h1>
            </div>

            {
                (gameStatus === GAME_STATUS.PLAYING && !completed) ? (
                    <LevelLayoutContainer 
                        levelOptions={levelOptions} 
                        dialog={dialog}
                        selected={selected}
                        alertStatus={alertStatus} 
                        handlers={{handleOptionClick, handleSubmit}}
                    />
                ) : (gameStatus === GAME_STATUS.SUCCESS || completed) && <Congratulations level={level}/>
            }
        </>
    )
}