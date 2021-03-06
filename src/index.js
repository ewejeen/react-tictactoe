import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
        <button className="square"
                onClick={props.onClick}
                style={{backgroundColor : props.backgroundColor}}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        const winLines = this.props.winLines ? this.props.winLines : []; 
        
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={()=>this.props.onClick(i)}
                key={i}
                backgroundColor={winLines.indexOf(i) > -1 ? 'red' : 'white'}
        />
    );
  }

  render() {
    const row = [];
    let key = 0;
    for(let i=0;i<3;i++){
        const col = [];
        for(let j=0;j<3;j++){
            col.push(this.renderSquare((3 * i) + j));
            
            key++;
        }
        row.push(<div className="board-row" key={key}>{col}</div>)
    }

    return (
      <div>{row}</div>
    );
  }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            selected: null,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return ;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        
        this.setState({
            history: history.concat([{
                squares: squares,
                selectedSquare: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            isFinished: history.length === 9 ? 'Y' : 'N',
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
            selected : step
        });
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winner : null;
        const winLines = calculateWinner(current.squares) ? calculateWinner(current.squares).lines : null;

        const moves = history.map((step, move) => {
            const selSquare = step.selectedSquare;
            const rowNum = selSquare < 6 ? (selSquare < 3 ? 0 : 1) : 2;
            const colNum = selSquare % 3 === 1 || selSquare % 3 === 0 ? (selSquare % 3 === 0 ? 0 : 1) : 2;

            const desc = move ?
                'Go to move #' + move + " (" + rowNum + "," + colNum + ")" : 'Go to game start';
            return (
                <li key={move}>
                    <button style={{fontWeight : this.state.selected === move ? 'bold' : 'normal'}} onClick={() => {this.jumpTo(move)}}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        } else{
            if(this.state.isFinished === 'Y'){
                status = 'DRAW';
            } else{
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winLines={winLines}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {lines: lines[i], winner: squares[a]};
      }
    }
    return null;
  }