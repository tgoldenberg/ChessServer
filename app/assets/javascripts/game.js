function saveGame(data, url) {
  $.ajax({
    url: url,
    method: "POST",
    data: data
  });
}

// NEW GAME
function newGame(data, dispatcher) {
  // data : channel_name, time_control, color, white_name, black_name, white_id, black_id
  var channel = dispatcher.subscribe(data.channel_name),
      clock = new ChessClock(data, channel),
      color = data.color[0],
      orientation = data.color,
      chess = new Chess(),
      gameOver = false,
      gameData = {game: {white_id: data.white_id, black_id: data.black_id}},
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
        gameData.game.pgn = chess.pgn();
        var url = $('#users-path').data('url');
        saveGame(gameData, url);
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
  });

  board = ChessBoard('board', config);
  clock.start();
}
