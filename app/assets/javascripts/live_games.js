function updateLiveGames(data) {
  var table = $('#live_games');
  var headings = $('<tr>');
  headings.append( $('<th>', {text: 'Time'})  );
  headings.append( $('<th>', {text: 'White'}) );
  headings.append( $('<th>', {text: 'Black'}) );
  table.empty().append(headings);
  
  data.forEach(function(game) {
  var row = $('<tr>');
  row.append( $('<td>', {text: game.time_control.toString() + "-min"}) );
  row.append( $('<td>', {text: game.player_info.white_name}) );
  row.append( $('<td>', {text: game.player_info.black_name}) );
  row.append( 
    $('<button>', {
      class: 'watch',
      text: 'Watch Game',
      data: {'channel': game.channel_name}
    })
  );
  table.append(row);
  });
}