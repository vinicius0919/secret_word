//CSS
import "./App.css";

//REACT
import { useCallback, useEffect, useState } from "react";

// DATA
import { wordsList } from "./data/words";

//COMPONENTS
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import { use } from "react";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const guessesQty = 10;

  const [gameStage, setGameStage] = useState(stages[0].name);

  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setletters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const PickWordAndCategory = useCallback(() => {
    // pick a rando category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    // pick a random word

    const word =
    words[category][Math.floor(Math.random() * words[category].length)];
    
    return { word, category };
  },[words]);
  
  //
  
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();
    
    // pick word and category
    
    const { word, category } = PickWordAndCategory();
    
    // create array of letter
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    setPickedWord(word);
    setPickedCategory(category);
    setletters(wordLetters);

    setGameStage(stages[1].name);
  },[PickWordAndCategory]);

  // process de letter inut

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if lertter has already been utilized

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => (actualGuesses - 1));
    }

  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check if player win

  useEffect(() => {
    const uniqueLetter = [...new Set(letters)];

    if (uniqueLetter.length === guessedLetters.length && gameStage === stages[1].name ) {
      // add score
      setScore((actualScore) => (actualScore + 100));

      // restar the game with new word
      setGuesses(guessesQty);
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // restarts all the game

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage == "start" && <StartScreen startGame={startGame} />}
      {gameStage == "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage == "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
