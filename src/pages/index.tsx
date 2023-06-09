import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type Player = "player" | "computer";
type Result = "tie game" | "player wins" | "computer wins" | undefined;

const Home: NextPage = () => {
  const [ impossibleComputer, setImpossibleComputer ] = useState(false);
  const [moves, setMoves] = useState({
    player: "",
    computer: "",
  });
  const [scores, setScores] = useState({
    player: 0,
    computer: 0,
  });
  const [result, setResult]: [Result, Dispatch<SetStateAction<Result>>] =
    useState();

  const toCamelCase = (text: string) => {
    const words = text.split(" ");
    return words.map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1)
    ).join(" ");
  };

  const newGame = () => {
    setResult(undefined);
    setMoves({player: "", computer: ""});
  };

  const calculateResult = (playerMove: string, computerMove: string) => {
    const options = ["rock", "paper", "scissors"];
    const playerMoveNum = options.indexOf(playerMove);
    const computerMoveNum = options.indexOf(computerMove);
    if ((playerMoveNum + 1) % 3 === computerMoveNum ) {
      const newScores = {player: scores.player, computer: ++scores.computer};
      console.log(newScores);
      setResult("computer wins");
      setScores(newScores);
    } else if ((playerMoveNum + 2) % 3 === computerMoveNum) {
      const newScores = {player: ++scores.player, computer: scores.computer};
      console.log(newScores);
      setResult("player wins");
      setScores(newScores);
    } else {
      setResult("tie game");
    }
  };

  const getComputerMove = (fair: boolean, playerMove: string) => {
    let computerMove = "";
    if (fair) {
      const number = Math.floor(Math.random() * 3);
      switch (number) {
        case 0:
          computerMove = "rock";
          break;
        case 1:
          computerMove = "paper";
          break;
        case 2:
          computerMove = "scissors";
          break;
        default:
          break;
      }
    } else {
      switch (playerMove) {
        case "rock":
          computerMove = "paper";
          break;
        case "paper":
          computerMove = "scissors";
          break;
        case "scissors":
          computerMove = "rock";
          break;
        default:
          break;
      }
    }

    return computerMove;
  }

  const handleMove = (playerMove: string) => {
    let fair = true;
    if (impossibleComputer) {
      const number = Math.floor(Math.random() * 100);
      if (number > 0) {fair = false}  
    }

    const computerMove = getComputerMove(fair, playerMove);
    setMoves({ player: playerMove, computer: computerMove });
    calculateResult(playerMove, computerMove);
  };

  const renderChoice = (name: string, hover = false) => {
    const hoverStyle = hover
      ? "hover:shadow-[0px_0px_20px_5px] hover:shadow-sky-500 cursor-pointer"
      : "";
    let containerStyle: string;

    switch (name) {
      case "rock": {
        containerStyle = `border border-stone-700 bg-stone-500`;
        break;
      }
      case "paper": {
        containerStyle = `border border-white bg-white`;
        break;
      }
      case "scissors": {
        containerStyle = `border border-gray-700 bg-gray-500`;
        break;
      }
      default: {
        containerStyle = `border border-sky-700 bg-sky-500`;
      }
    }

    return (
      <button
        className={`${containerStyle} ${hoverStyle} flex h-16 md:h-28 w-16 md:w-28 items-center justify-center font-bold text-black md:text-lg`}
        onClick={hover ? () => handleMove(name): undefined}
      >
        {toCamelCase(name)}
      </button>
    );
  };

  const renderMove = (playerName: Player, choice: string) => {
    const color = playerName === "player" ? "sky" : "fuchsia";
    const displayText = (
      <p className={`text-xl md:text-3xl text-${color}-500`}>
        {toCamelCase(playerName)} Chose {toCamelCase(choice)}
      </p>
    );
    const displayChoice = (
      <div className="grid justify-center">{renderChoice(choice)}</div>
    );

    return (
      <div className="grid items-center justify-center gap-3 p-3">
        {playerName === "player" ? displayChoice : displayText}
        {playerName === "player" ? displayText : displayChoice}
      </div>
    );
  };

  const renderScore = (player: Player) => {
    const color = player === "player" ? "sky" : "fuchsia";
    return (
      <p className={`text-lg md:text-2xl text-${color}-500`}>
        {toCamelCase(player)}: {scores[player]}
      </p>
    );
  };

  return (
    <>
      <Head>
        <title>Rock Paper Scissors</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen flex min-h-screen flex-col items-center justify-between gap-5 bg-slate-800 p-2 text-white">
        <section className="flex flex-col h-1/5 w-full gap-2 md:gap-5 text-center justify-center items-center">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl text-fuchsia-500">Rock Paper Scissors</h1>
          {/* Score & Difficulty */}
          <div className="grid w-10/12 items-center md:gap-5 md:flex-row">
            <div className="flex flex-col md:gap-2 md:justify-self-center">
              {renderScore("computer")}
              {renderScore("player")}
            </div>
            <div className="flex gap-5 items-center justify-center md:justify-self-end">
              <p className="text-md md:text-lg">Computer Difficulty</p>
              <button 
                className="text-md border rounded-full p-1 w-24 bg-gradient-to-r from-fuchsia-700 to-sky-700"
                onClick={() => setImpossibleComputer(!impossibleComputer)}
              >
                {impossibleComputer ? "Impossible" : "Easy"}
              </button>
            </div>
          </div>
        </section>
        {/* Game Board */}
        <section className="flex min-h-[20rem] md:min-h-[34rem] w-10/12 flex-col items-center justify-between rounded-3xl border shadow-[0px_0px_5px_2px] shadow-sky-500">
          {/* Computer Display */}
          {moves.computer && renderMove("computer", moves.computer)}
          {/* Game Result */}
          {result && (
            <div className="flex flex-col gap-2 md:gap-5 items-center">
              <p className="bg-gradient-to-r from-fuchsia-500 to-sky-500 bg-clip-text text-xl md:text-3xl font-bold text-transparent">
                {toCamelCase(result)}!
              </p>
              <button 
                className="border rounded-full p-1 w-24 bg-gradient-to-r from-fuchsia-700 to-sky-700 md:text-2xl md:w-36"
                onClick={() => newGame()}  
              >
                New Game
              </button>
            </div>
          )}
          {/* Player Display */}
          {moves.player && renderMove("player", moves.player)}
        </section>
        {/* Player Options */}
        <section className="grid h-1/5 w-10/12 gap-3 text-center">
          <p className="text-2xl md:text-3xl text-sky-500">Select Your Move</p>
          <div className="flex gap-5 md:gap-28 justify-center">
            {renderChoice("rock", result ? false : true)}
            {renderChoice("paper", result ? false : true)}
            {renderChoice("scissors", result ? false : true)}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
