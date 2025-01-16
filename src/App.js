import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const App = () => {
  const [game, setGame] = useState(new Chess());
  const [stockfish, setStockfish] = useState(null);
  const [bestMove, setBestMove] = useState("");

  useEffect(() => {
    const stockfishWorker = new Worker("/js/stockfish-16.1-lite-single.js");
    setStockfish(stockfishWorker);

    stockfishWorker.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith("bestmove")) {
        const move = message.split(" ")[1];
        setBestMove(move); // best move to display
      }
    };

    return () => {
      stockfishWorker.terminate();
    };
  }, []);

  // Handling piece movements on the chessboard
  const onDrop = (sourceSquare, targetSquare) => {
    // Create a copy of the current game state using FEN notation
    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,   // starting square
        to: targetSquare,     // target square
        promotion: 'q'        // promote to a queen
      });

      if (move === null) {
        return false; // invalid move
      }

      // when valid move, update the game state with the new position
      setGame(gameCopy);

      if (stockfish) {
        stockfish.postMessage(`position fen ${gameCopy.fen()}`); // Send the board position in FEN format
        stockfish.postMessage("go depth 15"); // Instruct Stockfish to analyze the position up to a depth of 15 moves
      }

      return true; // valid move
    } catch (error) {
      console.error(error.message);
      return false; // invalid move
    }
  };

  return (
    <div>
      <div>
        <h1>Chess Game</h1>
        <Chessboard
          position={game.fen()}      // Set the chessboard position to the current game state
          onPieceDrop={onDrop}       // Trigger the onDrop function when a piece is moved
          boardWidth={500}           // Set the width of the chessboard to 500px
        />
      </div>
      <div>
        <h3>Best Move: {bestMove || "Calculating..."}</h3>
      </div>
    </div>
  );
};

export default App;