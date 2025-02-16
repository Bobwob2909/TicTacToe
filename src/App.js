import { useState } from 'react';

function Square({ value, onSquareClick, className, isWinning }) {
  return (
    <button
      className={`square ${className} ${isWinning ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const { winner, winningSquares } = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (!squares.includes(null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] != null || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div className="game-board">
      <div className="status">{status}</div>
      <div className="board-grid">
        <div className="board-row">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                className={i === 0 ? 'top-left' : i === 2 ? 'top-right' : ''}
                isWinning={winningSquares.includes(i)}
              />
            ))}
        </div>
        <div className="board-row">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Square
                key={i + 3}
                value={squares[i + 3]}
                onSquareClick={() => handleClick(i + 3)}
                isWinning={winningSquares.includes(i + 3)}
              />
            ))}
        </div>
        <div className="board-row">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Square
                key={i + 6}
                value={squares[i + 6]}
                onSquareClick={() => handleClick(i + 6)}
                className={i === 0 ? 'bottom-left' : i === 2 ? 'bottom-right' : ''}
                isWinning={winningSquares.includes(i + 6)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="app-container">
      {/* Title and Subtitle */}
      <div className="title-container">
        <h1 className="main-title">TicTacToe</h1>
        <h3 className="subtitle">
          <a
            href="https://www.linkedin.com/in/akshayunni/"
            target="_blank"
            rel="noopener noreferrer"
          >
            By Akshay Unnikrishnan
          </a>
        </h3>
      </div>

      <div className="container">
        <div className="game">
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
          <div className="game-info">
            <h3>Move Log</h3>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: [] };
}
