// src/components/ChessGame.js

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { getBestMove } from '../utils/chessAI';
import gameSettings from '../config/gameSettings';
import aiSettings from '../config/aiSettings';

function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState(gameSettings.defaultOrientation);
  const [difficulty, setDifficulty] = useState(aiSettings.defaultDifficulty);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Update FEN when game changes
    setFen(game.fen());
    
    // Update move history
    const history = game.history({ verbose: true });
    setMoveHistory(history);
    
    // If game is over, alert the result
    if (game.isGameOver()) {
      let result = "";
      if (game.isCheckmate()) {
        result = game.turn() === 'w' ? "Black wins by checkmate!" : "White wins by checkmate!";
      } else if (game.isDraw()) {
        result = "Game ended in draw.";
      } else if (game.isStalemate()) {
        result = "Game ended in stalemate.";
      } else if (game.isThreefoldRepetition()) {
        result = "Game ended by threefold repetition.";
      } else if (game.isInsufficientMaterial()) {
        result = "Game ended due to insufficient material.";
      }
      
      setTimeout(() => {
        alert(result);
      }, 500);
    }
  }, [game]);

  // Make AI move
  const makeAIMove = () => {
    if (game.isGameOver() || isThinking) return;
    
    setIsThinking(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const aiMove = getBestMove(game, difficulty);
      if (aiMove) {
        game.move(aiMove);
        setGame(new Chess(game.fen()));
      }
      setIsThinking(false);
    }, 500);
  };

  // Handle piece movement
  const onDrop = (sourceSquare, targetSquare) => {
    try {
      // Make player's move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: gameSettings.autoPromoteTo
      });
      
      if (move === null) return false; // Illegal move
      
      // Update game state
      setGame(new Chess(game.fen()));
      
      // Make AI move after a short delay
      setTimeout(makeAIMove, 300);
      
      return true;
    } catch (error) {
      return false;
    }
  };

  // Reset the game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
  };

  // Undo last move (both player and AI)
  const undoMove = () => {
    // Undo twice to rollback both AI and player moves
    game.undo();
    game.undo();
    setGame(new Chess(game.fen()));
  };

  // Flip the board
  const flipBoard = () => {
    setOrientation(orientation === 'white' ? 'black' : 'white');
  };

  // Change difficulty level
  const changeDifficulty = (e) => {
    setDifficulty(parseInt(e.target.value));
  };

  return (
    <div className="chess-game">
      <div className="game-controls">
        <button onClick={resetGame}>New Game</button>
        <button onClick={undoMove}>Undo Move</button>
        <button onClick={flipBoard}>Flip Board</button>
        <div className="difficulty-selector">
          <label htmlFor="difficulty">AI Level: </label>
          <select 
            id="difficulty" 
            value={difficulty} 
            onChange={changeDifficulty}
            disabled={isThinking}
          >
            <option value="1">Beginner</option>
            <option value="2">Casual</option>
            <option value="3">Intermediate</option>
            <option value="4">Advanced</option>
            <option value="5">Expert</option>
          </select>
        </div>
      </div>
      
      <div className="board-container">
        <Chessboard 
          position={fen} 
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          showBoardNotation={gameSettings.showNotation}
          animationDuration={gameSettings.animationSpeed}
          areArrowsAllowed={true}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          }}
          customSquareStyles={{
            ...(gameSettings.highlightOptions.lastMove && moveHistory.length > 0 ? {
              [moveHistory[moveHistory.length - 1].from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
              [moveHistory[moveHistory.length - 1].to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
            } : {})
          }}
        />
      </div>
      
      <div className="game-info">
        <div className="status">
          {game.isGameOver() 
            ? "Game over" 
            : isThinking 
              ? "AI is thinking..." 
              : `${game.turn() === 'w' ? "White" : "Black"} to move`}
        </div>
        <div className="move-history">
          <h3>Move History</h3>
          <div className="moves">
            {game.history().map((move, index) => (
              <span key={index}>
                {index % 2 === 0 ? `${Math.floor(index/2) + 1}. ` : ''}
                {move} {index % 2 === 1 ? ' ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChessGame;