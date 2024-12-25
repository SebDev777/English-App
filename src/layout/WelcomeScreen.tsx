import React from "react"
import "./styles/WelcomeScreen.css"

const loadingText = "Loading...";

type WelcomeScreenStatus = "WAITING" | "WELCOME";

interface WelcomeScreenProps {
    status: WelcomeScreenStatus;
}

export default function WelcomeScreen({status} : WelcomeScreenProps) {

    return (
        <div className="welcome-screen">
            <h1>Welcome to English Tests!</h1>
            <img className="robot-logo" src="https://icones.pro/wp-content/uploads/2022/10/icone-robot-bleu.png" />
            {
                status === "WAITING" ? (
                    <div className="loading-txt">
                        {loadingText.split('').map((char, index) => (
                            <span style={{
                                animationDelay: `${index/10}s`
                            }} key={index}>{char}</span>
                        ))}
                    </div>
                ) : <h1>Loaded and ready to start!</h1>
            }
            <span className="author">Made by SebDev, v0.5</span>
        </div>
    );
}