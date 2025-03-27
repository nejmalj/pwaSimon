import React, { useEffect, useState } from "react";
import "./App.css";
import InstallPWA from "./InstallPwa";
import soundFile from "./Concrete2.wav";

function App() {
  const audio = new Audio(soundFile);
  const colors = ["red", "blue", "green", "yellow"];
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  useEffect(() => {
    if (sequence.length === 0) {
      startNewGame();
    }
  }, []);

  useEffect(() => {
    if (!isPlayerTurn && sequence.length > 0) {
      showSequence();
    }
  }, [sequence]);

  const startNewGame = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence([newColor]);
    setPlayerIndex(0);
    setIsPlayerTurn(false);
  };

  const showSequence = async () => {
    setIsPlayerTurn(false);
    for (let i = 0; i < sequence.length; i++) {
      setCurrentColor(sequence[i]);

      navigator.vibrate(200);

      await new Promise((resolve) => setTimeout(resolve, 600));
      setCurrentColor(null);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    setIsPlayerTurn(true);
  };

  const selectColor = (color: string) => {
    if (!isPlayerTurn) return;
    audio.play();
    if (sequence[playerIndex] === color) {
      if (playerIndex + 1 === sequence.length) {
        setTimeout(() => {
          addNewColorToSequence();
        }, 500);
      } else {
        setPlayerIndex(playerIndex + 1);
      }
    } else {
      const n = new Notification("Fin du game");
      console.log(n);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          n.close();
        }
      });
      startNewGame();
    }
  };

  const addNewColorToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence([...sequence, newColor]);
    setPlayerIndex(0);
    setIsPlayerTurn(false);
  };

  return (
      <>
        <h1>Jeu du Simon</h1>
        {isPlayerTurn ? (
            <p>A ton tour !</p>
        ) : (
            <p>Simon joue...</p>
        )}
        <div className="simonGame">
          <div className="topHalf">
            <div
                className={`redColor ${currentColor === "red" ? "active" : ""}`}
                onClick={() => selectColor("red")}
            ></div>
            <div
                className={`blueColor ${currentColor === "blue" ? "active" : ""}`}
                onClick={() => selectColor("blue")}
            ></div>
          </div>
          <div className="bottomHalf">
            <div
                className={`greenColor ${currentColor === "green" ? "active" : ""}`}
                onClick={() => selectColor("green")}
            ></div>
            <div
                className={`yellowColor ${currentColor === "yellow" ? "active" : ""}`}
                onClick={() => selectColor("yellow")}
            ></div>
          </div>
        </div>
        <button className="play" onClick={startNewGame}>
          Nouvelle partie
        </button>
        <InstallPWA/>
      </>
  );
}

export default App;
