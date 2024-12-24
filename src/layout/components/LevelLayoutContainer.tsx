import React, { useState, useEffect} from "react"

export default function LevelLayoutContainer({levelOptions, dialog, alertStatus, handlers}) {

    const { handleOptionClick, handleSubmit } = handlers
    return (
        <div className="container">
            <div className="dialog">
                <img className="robot-logo" src="https://icones.pro/wp-content/uploads/2022/10/icone-robot-bleu.png" />
                <h3>{dialog}</h3>
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
                                <span>{
                                    `${option.text} ${option.selected ? `(${option.selectedAt + 1})` : ""}`
                                }</span>
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