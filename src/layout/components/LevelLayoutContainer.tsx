import React, { useEffect } from "react"

import { LevelOptions } from "../../types/AppTypes"

interface Handlers {
    handleOptionClick: (index: number) => void,
    handleSubmit: () => void
}

interface ComponentProps {
    levelOptions: Array<LevelOptions>,
    dialog: string,
    alertStatus: string,
    handlers: Handlers,
    selected: string[]
}

export default function LevelLayoutContainer({levelOptions, dialog, alertStatus, handlers, selected} : ComponentProps) {
    
    const { handleOptionClick, handleSubmit } = handlers
    console.log(selected)
    console.log(levelOptions)

    useEffect(() => {
        /* Select all the blank class elements */
        const elements = document.querySelectorAll(".blank")
        elements.forEach((element, index) => {
            const selectedItem = selected[index]
            const htmlElement = element as HTMLElement;
            htmlElement.innerText = selectedItem ? selectedItem + " " : "______ "
            htmlElement.classList.add("added")
        });
    }, [selected])

    return (
        <div className="container">
            <div className="dialog">
                <img className="robot-logo" src="https://icones.pro/wp-content/uploads/2022/10/icone-robot-bleu.png" />
                <div className="dialog-container">
                {<h3>
                    {
                        dialog.split(" ").map((word, index) => {
                            /* If the word is a blank space, return a span with the word */
                            const indexOfBlank = word.indexOf("______")
                            if (indexOfBlank > -1) {
                                return <span key={index} className="blank">{word + " "}</span>
                            } else {
                                return word + " "
                            }
                        })
                    }
                </h3>
                }
                </div>
            </div>
            <div className="answers">
                {
                    levelOptions.map((option, index) => {
                        return (
                            <div 
                                key={index} 
                                className={`option ${option.selected ? "selected" : ""}`}
                                onClick={() => handleOptionClick(index)}
                            >
                                <span>{option.text}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className="submit">
                <button onClick={handleSubmit}>Submit</button>
                {
                    alertStatus !== "" && (
                        <h2 className="alert">
                            {alertStatus}
                        </h2>
                    )
                }
            </div>
    </div>
    )
}