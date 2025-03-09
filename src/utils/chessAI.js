// src/utils/chessAI.js

import Chess from 'chess.js';
import aiSettings from '../config/aiSettings';

// Piece values for material evaluation
const PIECE_VALUES = {
  p: 100,   // pawn
  n: 320,   // knight
  b: 330,   // bishop
  r: 500,   // rook
  q: 900,   // queen
  k: 20000  // king
};

/**
 * Evaluates a chess position from white's perspective
 * @param {Chess} game - The chess.js game object
 * @returns {number} - Positive score favors white, negative favors black
 */
const evaluatePosition = (game) => {
  // If checkmate, return extreme value
  if (game.in_checkmate()) {
    return game.turn() === 'w' ? -10000000 : 10000000;
  }
  
  // If draw, return 0
  if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
    return 0;
  }

  const board = game.board();
  let score = 0;
  
  // Material evaluation
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const pieceValue = PIECE_VALUES[piece.type];
        score += piece.color === 'w' ? pieceValue : -pieceValue;
        
        // Add position value for pawns based on their advancement
        if (piece.type === 'p') {
          // White pawns get bonus for advancing
          if (piece.color === 'w') {
            score += (7 - i) * 10;
          } else {
            // Black pawns get bonus for advancing
            score -= i * 10;
          }
        }
      }
    }
  }
  
  // Mobility evaluation (number of legal moves)
  if (aiSettings.evaluationWeights.mobility > 0) {
    const whiteToMove = game.turn() === 'w';
    const currentMobility = game.moves().length;
    
    // Clone the game to see opponent's mobility
    const tempGame = new Chess(game.fen());
    tempGame.move('e3'); // Make a dummy move to switch turns
    const opponentMobility = tempGame.moves().length;
    
    const mobilityScore = (whiteToMove ? currentMobility - opponentMobility : opponentMobility - currentMobility) * 
                         aiSettings.evaluationWeights.mobility;
    score += mobilityScore;
  }
  
  // Center control evaluation
  if (aiSettings.evaluationWeights.centerControl > 0) {
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    for (const square of centerSquares) {
      const piece = game.get(square);
      if (piece) {
        const value = piece.color === 'w' ? 10 : -10;
        score += value * aiSettings.evaluationWeights.centerControl;
      }
    }
  }
  
  return score;
};

/**
 * Minimax algorithm with alpha-beta pruning
 * @param {Chess} game - The chess.js game object
 * @param {number} depth - How many moves to look ahead
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @param {boolean} isMaximizingPlayer - Whether current player is maximizing
 * @returns {number} - Best score for the position
 */
const minimax = (game, depth, alpha, beta, isMaximizingPlayer) => {
  // Base case: if depth reached or game over
  if (depth === 0 || game.game_over()) {
    return evaluatePosition(game);
  }

  const moves = game.moves();
  
  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minEval;
  }
};

/**
 * Find the best move for the current position
 * @param {Chess} game - The chess.js game object
 * @param {number} depth - How many moves to look ahead
 * @returns {string} - The best move in algebraic notation
 */
export const findBestMove = (game, depth = 3) => {
  const isMaximizing = game.turn() === 'w';
  let bestMove = null;
  let bestEval = isMaximizing ? -Infinity : Infinity;
  
  const moves = game.moves();
  
  // If only one move, just return it
  if (moves.length === 1) {
    return moves[0];
  }
  
  // Randomize moves to add variety when multiple moves have same evaluation
  moves.sort(() => Math.random() - 0.5);
  
  // Evaluate each move
  for (const move of moves) {
    game.move(move);
    const evaluation = minimax(
      game, 
      depth - 1, 
      -Infinity, 
      Infinity, 
      !isMaximizing
    );
    game.undo();
    
    if (isMaximizing) {
      if (evaluation > bestEval) {
        bestEval = evaluation;
        bestMove = move;
      }
    } else {
      if (evaluation < bestEval) {
        bestEval = evaluation;
        bestMove = move;
      }
    }
  }
  
  return bestMove;
};

/**
 * Find the best move with difficulty adjustment
 * @param {Chess} game - The chess.js game object
 * @param {number} difficulty - Difficulty level (1-5)
 * @returns {string} - The best move in algebraic notation
 */
export const getBestMove = (game, difficulty = aiSettings.defaultDifficulty) => {
  // Map difficulty level to search depth
  const depthMap = {
    1: 1,  // Easiest - only look 1 move ahead
    2: 2,  // Easy
    3: 3,  // Medium
    4: 4,  // Hard
    5: 5   // Hardest - look 5 moves ahead
  };
  
  const depth = depthMap[difficulty] || 3;
  
  // For lower difficulties, sometimes make random moves
  if (difficulty < 3 && Math.random() < 0.3) {
    const moves = game.moves();
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  return findBestMove(game, depth);
};

export default { getBestMove };