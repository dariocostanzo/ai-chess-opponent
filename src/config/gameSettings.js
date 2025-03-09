// src/config/gameSettings.js

export default {
  defaultOrientation: 'white',
  showLegalMoves: true,
  showNotation: true,
  animationSpeed: 200,
  autoPromoteTo: 'queen',
  pieceStyle: 'standard',
  boardTheme: 'blue',
  sounds: {
    enabled: true,
    move: true,
    capture: true,
    check: true
  },
  highlightOptions: {
    lastMove: true,
    check: true,
    premove: false
  },
  autoSave: {
    enabled: true,
    interval: 5 // save every 5 moves
  }
};