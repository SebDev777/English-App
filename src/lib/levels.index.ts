export const levels = [
    {
        levelOptions: [
            "Roboto",
            "years old",
            "robot",
            "Mars",
            "programming",
            "playing games"
        ],
        dialog: "Hello, my name is ______, I'm 17 ______. I'm a ______ and I'm from ______. I like ______ and ______.",
        title: "Meet roboto",
        difficulty: "easy"
    },
    {
        dialog: "Comes from cow: ______. Comes from chicken: ______. Comes from pig: ______.",
        levelOptions: [
            "milk",
            "eggs",
            "bacon"
        ],
        title: "Where does it come from?",
        difficulty: "easy"
    },
    {
        dialog: "The Mythical creature that is half lion and half eagle is called: ______. Something that is very small is called: ______. A person who is learning a job from a skilled employer is called: ______.",
        levelOptions: [
            "griffin",
            "tiny",
            "apprentice"
        ],
        title: "Guess the word",
        difficulty: "hard"
    }
]

export const getPlayerLevel = () : number => {
    const levelsData = localStorage.getItem("levelsData")
    if (!levelsData) return 0
    let completed = 0
    JSON.parse(levelsData).forEach((level: any) => {
        if (level.completed) completed++
    })
    return completed
}