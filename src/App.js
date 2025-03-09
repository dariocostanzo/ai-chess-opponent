import React from 'react';
import ChessGame from './components/ChessGame';
import './styles/ChessGame.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Chess Opponent</h1>
        <p>Play against an AI with adjustable difficulty levels</p>
      </header>
      <main>
        <ChessGame />
      </main>
      <footer>
        <p>Created by Dario Costanzo - <a href="https://dariocostanzo.github.io/" target="_blank" rel="noopener noreferrer">Portfolio</a></p>
      </footer>
    </div>
  );
}

export default App;