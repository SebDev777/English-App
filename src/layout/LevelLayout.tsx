import React, { useState, useEffect } from 'react';
import './styles/LevelLayout.css';

import { APP_STATES, AppState } from "../App.tsx";
import { AppOptions, LevelOptions } from '../types/AppTypes';
import {levels, getPlayerLevel, LevelsDataHandle} from "../lib/levels.index.ts"

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
    const [ levelOptions, setLevelOptions ] = useState<LevelOptions[]>([])
    const [ dialog, setDialog ] = useState<string>("")
    const [ alertStatus, setAlertStatus ] = useState<string>("")
    const [ gameStatus, setGameStatus ] = useState<GameStatus>(GAME_STATUS.PLAYING)
    const [completed, setCompleted] = useState<boolean>(false)

    useEffect(() => {
        /* Auto Submit when everything is selected */
        if (levelOptions.length <= 0) return
        if (selected.length === levelOptions.length) {
            handleSubmit()
        }
    }, [selected, levelOptions])

    useEffect(() => {
        const levelsData = LevelsDataHandle.get()
        if (!levelsData) return
        if (levelsData[level].completed) return
        if (levelsData[level].startedAt) return
        /* Here we set the startedAt time */
        levelsData[level].startedAt = new Date().getTime()
        LevelsDataHandle.set(levelsData)
    }, [])

    useEffect(() => {
        const playerLevel = getPlayerLevel()
        if (playerLevel > level) {
            setCompleted(true)
        }
        const levelOptions : string[] = levels[level].levelOptions
        let newOptions : Array<LevelOptions> = []
        for (let option in levelOptions) {
            newOptions.push({
                text: levelOptions[option],
                selected: false,
                selectedAt: selected.length-1
            })
        }

        setSelected([])
        setLevelOptions(newOptions)
        setDialog(levels[level].dialog)
    }, [])

    function goBack() {
        setAppState(APP_STATES.LEVEL_SELECTION)
    }

    function reset() {
        setSelected([])
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
        setLevelOptions(levelOptions.map((option, i) => {
            if (i !== index) return option
            setAlertStatus("")
            setSelected(option.selected === false
                ? [...selected, option.text]
                : selected.filter(item => item !== option.text)
            )

            return {
                text: option.text,
                selected: !option.selected,
                selectedAt: selected.length
            }
        }))
    }

    function handleSubmit() {
        let allSelected = levelOptions.filter(option => option.selected === true)
        if (allSelected.length !== levelOptions.length) {
            return setAlertStatus("You must select all options")
        }

        const Correct = levelOptions.filter(option => {
            return option.selectedAt === levelOptions.indexOf(option)
        })

        console.log(Correct)
        const levelsData = LevelsDataHandle.get()
        switch (Correct.length) {
            case levelOptions.length:
                setGameStatus(GAME_STATUS.SUCCESS);
            
                if (levelsData) {
                    const completionTime = String((new Date().getTime() - levelsData[level].startedAt) / 1000) + "s"
                    levelsData[level].completed = true
                    levelsData[level].completionTime = completionTime
                    LevelsDataHandle.set(levelsData)
                }
                break
            default:
                setAlertStatus("You got some answers wrong, try again!")
                reset()

                if (levelsData) {
                    levelsData[level].attempts++
                    LevelsDataHandle.set(levelsData)
                }
                break
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