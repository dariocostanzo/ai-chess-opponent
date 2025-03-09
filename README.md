# AI Chess Opponent

An interactive chess application that allows you to play against different levels of AI opponents.

## Overview

This application enables users to play chess against an AI opponent with adjustable difficulty levels. It features a clean user interface with a responsive chessboard and move validation.

## Features

- Interactive chess board with drag-and-drop piece movement
- Multiple AI difficulty levels
- Move validation and legal move highlighting
- Game state tracking (checkmate, stalemate, etc.)
- Move history and notation
- Ability to undo moves
- Option to save and load games

## Tech Stack

- Frontend: React.js with TypeScript
- Chess Logic: chess.js
- Board UI: react-chessboard
- AI: Custom minimax algorithm with alpha-beta pruning

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dariocostanzo/ai-chess-opponent.git
   cd ai-chess-opponent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_DEFAULT_DIFFICULTY=3
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to play.

## Usage

### Playing Against the AI

1. Start a new game by clicking "New Game"
2. Select the AI difficulty level (1-5, where 5 is the most challenging)
3. Make your move by dragging and dropping your pieces
4. The AI will automatically respond with its move

### Game Controls

- **New Game**: Starts a fresh game
- **Undo Move**: Reverts the last move (both yours and the AI's)
- **Save Game**: Saves the current game state to local storage
- **Load Game**: Loads a previously saved game
- **Flip Board**: Switches the board orientation

### AI Difficulty Levels

- **Level 1**: Beginner - Makes random legal moves with occasional tactical decisions
- **Level 2**: Casual - Uses basic evaluation and looks 2 moves ahead
- **Level 3**: Intermediate - Evaluates positions more deeply and looks 3 moves ahead
- **Level 4**: Advanced - Strong positional understanding and looks 4 moves ahead
- **Level 5**: Expert - Comprehensive evaluation and looks 5+ moves ahead

## Configuration Options

The app can be configured by modifying the following files:

### `src/config/aiSettings.js`

```javascript
export default {
  defaultDifficulty: 3,
  maxDepth: 5,
  useOpeningBook: true,
  evaluationWeights: {
    material: 100,
    position: 10,
    mobility: 5,
    kingProtection: 3,
    pawnStructure: 2
  }
};
```

### `src/config/gameSettings.js`

```javascript
export default {
  defaultOrientation: 'white',
  showLegalMoves: true,
  showNotation: true,
  animationSpeed: 200,
  autoPromoteTo: 'queen',
  pieceStyle: 'standard',
  boardTheme: 'blue'
};
```

## Troubleshooting

### Common Issues

**Issue**: AI doesn't make a move after you move a piece
**Solution**: Check your console for errors. Ensure you're connected to the internet if the AI logic is served from a remote endpoint.

**Issue**: Board appears broken or pieces don't show up
**Solution**: Try clearing your browser cache, or try a different browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Dario Costanzo - [your email or contact information]
Project Link: [https://github.com/dariocostanzo/ai-chess-opponent](https://github.com/dariocostanzo/ai-chess-opponent)
