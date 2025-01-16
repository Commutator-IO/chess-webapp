import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const App = () => {
  const [game, setGame] = useState(new Chess());

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
      return true; // valid move
    } catch (error) {
      console.error(error.message);
      return false; // invalid move
    }
  };

  return (
    <div>
      <h1>Chess Game</h1>
      <Chessboard
        position={game.fen()}      // Set the chessboard position to the current game state
        onPieceDrop={onDrop}       // Trigger the onDrop function when a piece is moved
        boardWidth={500}           // Set the width of the chessboard to 500px
      />
    </div>
  );
};

export default App;