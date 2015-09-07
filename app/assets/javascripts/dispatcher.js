function newGame(dispatcher, user_id, data) {
  var color = (data.white_id === user_id ? 'white' : 'black'),
      data = $.extend({}, data, {color: color}),
      
      channel_name = data.channel_name,
      channel = dispatcher.subscribe(channel_name),
      callbacks = {
        move: function(data) {
          channel.trigger('move', data);
        },  
        gameOver: function() {
          channel.trigger('game_over');  
        },
        saveGame: function(data) {
          var saveData = {game: data, channel_name: channel_name};
          dispatcher.trigger('save_game', saveData);
        },
        startGame: function(data) {
          data.channel_name = channel_name;
          dispatcher.trigger('start_game', data);
        }
      },
      game = new ChessGame(data, callbacks);
      
  channel.bind('move', function(data) {
    game.move(data);  
  });
  channel.bind('game_over', function(data) {
    game.game_over(data);
    dispatcher.unsubscribe(channel_name);
    $('#resign').off('click').hide();
  });
  
  $('#resign').show().on('click', function() {
    if (confirm("Are you sure?")) {
      var result = (color === 'white' ? 'b' : 'w');
      channel.trigger('game_over', {result: result});
    }  
  });
  
  game.start();
}

function observeGame(dispatcher, channel_name) {
  var channel = dispatcher.subscribe(channel_name);
  var board = ChessBoard('board', {
    position: 'start',
    pieceTheme: '/assets/wikipedia/{piece}.png'
  });
  channel.bind('move', function(data) {
    board.position(data.fen);  
  });
  channel.bind('game_over', function(data) {
    dispatcher.unsubscribe(channel_name);  
  });
  
  return channel;
}
