function ChessGame(data, callbacks) {
  // data : channel_name, time_control, color, white_name, black_name, white_id, black_id
  // callbacks: move(data) = channel.trigger('move', data), gameOver = channel.trigger('game_over')
  //            saveGame(data) = channel.trigger('save_game', data), startGame(data) = *add channel_name to data*channel.trigger('start_game', data);
  this.callbacks = callbacks;
  this.clock = new ChessClock(data, callbacks.gameOver);
  this.chess = new Chess();
  this.gameOver = false;
  this.board = null;
  this.gameData = {
    white_id: data.white_id,
    black_id: data.black_id
  };
  this.startData = {
    player_info: {white_name: data.white_name, black_name: data.black_name},
    time_control: data.time_control
  };
  
  var color = data.color[0],
      orientation = data.color,
      onSnapEnd = this.updateBoard.bind(this),
      regex = new RegExp("^" + color),
      onDragStart = function(source, piece, position, orientation) {
        if (this.gameOver === true || piece.search(regex) === -1)
          return false;
      }.bind(this),
      onDrop = function(source, target) {
        var move = this.chess.move({
          from: source,
          to: target,
          promotion: 'q'
        });  
        
        if (move === null) {
          return 'snapback';  
        } else {
          this.clock.toggleTimers(this.chess.turn());
          var moveData = {move: move, time: this.clock.timeData(), fen: this.chess.fen()};
          callbacks.move(moveData);
          
          if (this.chess.game_over()) {
            callbacks.gameOver();  
          }
        }
      }.bind(this)
      
  this.config = {
   draggable: true,
   position: 'start',
   orientation: orientation,
   pieceTheme: '/assets/wikipedia/{piece}.png',
   onDragStart: onDragStart,
   onDrop: onDrop,
   onSnapEnd: onSnapEnd
  };
}

ChessGame.prototype = {
  updateGameData: function() {
    this.gameData.pgn = this.chess.pgn();
    this.gameData.result = this.getResult.bind(this)();
  },
  
  updateBoard: function() {
    this.board.position(this.chess.fen());  
  },
  
  move: function(data) {
    this.chess.move(data.move);
    this.updateBoard.bind(this)();
    this.clock.syncTimers(data.time);
    this.clock.toggleTimers(this.chess.turn());
  },
  
  game_over: function(data) {
    this.gameOver = true;
    this.clock.stop();
    this.updateGameData.bind(this)();
    this.callbacks.saveGame(this.gameData);
  },
  
  start: function() {
    this.callbacks.startGame(this.startData);
    this.board = ChessBoard('board', this.config);
    this.clock.start();
  },
  
  getResult: function() {
    if (this.chess.in_checkmate()) {
      return (this.chess.turn() === 'w' ? 'b' : 'w');  
    }  else if (this.chess.in_draw()) {
      return "d";  
    } else if (this.clock.flagged()) {
      return this.clock.winner();  
    }
  }
};