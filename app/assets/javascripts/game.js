// NEW GAME
function newGame(data, dispatcher) {
  // data : channel_name, time_control, color, white_name, black_name, white_id, black_id
  var channel = dispatcher.subscribe(data.channel_name),
      timesUp = function() { channel.trigger('game_over'); },
      clock = new ChessClock(data, timesUp),
      color = data.color[0],
      orientation = data.color,
      chess = new Chess(),
      gameOver = false,
      gameData = {game: {white_id: data.white_id, black_id: data.black_id}, channel_name: data.channel_name},
      board;

  var onDrop = function(source, target) {
    var move = chess.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) {
      return 'snapback';
    } else {
      clock.toggleTimers(chess.turn());
      var moveData = {move: move, time: clock.timeData()};
      channel.trigger('move', moveData);

      if (chess.game_over()) {
        channel.trigger('game_over');
      }
    }
  };

  var updateBoard = function() {
    board.position(chess.fen());
  },
  onSnapEnd = updateBoard;

  var regex = new RegExp("^" + color),
  onDragStart = function(source, piece, position, orientation) {
    if (gameOver === true || piece.search(regex) === -1)
      return false;
  };

  var config = {
    draggable: true,
    position: 'start',
    orientation: orientation,
    pieceTheme: '/assets/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };

  channel.bind('move', function(data) {
    chess.move(data.move);
    updateBoard();
    clock.syncTimers(data.time);
    clock.toggleTimers(chess.turn());
  });

  channel.bind('game_over', function(data) {
    gameOver = true;
    clock.stop();
    gameData.game.pgn = chess.pgn();
    dispatcher.trigger('save_game', gameData);
  });
  
  var channel_name = data.channel_name;
  var player_info = {
    white_name: data.white_name,
    black_name: data.black_name
  };
  var data = {channel_name: channel_name, player_info: player_info, time_control: 5};
  
  dispatcher.trigger('start_game', data);
  board = ChessBoard('board', config);
  clock.start();
}
