// src/config/aiSettings.js

export default {
  defaultDifficulty: 3,
  maxDepth: 5,
  useOpeningBook: true,
  timeControl: {
    enabled: false,
    timePerMove: 5000 // 5 seconds per move
  },
  evaluationWeights: {
    material: 100,    // Value of pieces
    position: 10,     // Board position value
    mobility: 5,      // Number of available moves
    kingProtection: 3, // King safety
    pawnStructure: 2,  // Pawn formation quality
    centerControl: 4   // Control of center squares
  },
  // Piece-Square tables for positional evaluation
  pieceSquareTables: {
    pawn: [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5,  10, 25, 25, 10, 5,  5],
      [0,  0,  0,  20, 20, 0,  0,  0],
      [5, -5, -10, 0,  0, -10, -5, 5],
      [5,  10, 10, -20, -20, 10, 10, 5],
      [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    // Add more piece-square tables for other pieces
  }
};