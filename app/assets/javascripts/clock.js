function ChessClock(data, channel) {
  // data: color, time_control, white_name, black_name
  this.whiteTimer = new Timer(data.time_control);
  this.blackTimer = new Timer(data.time_control);
  this.whiteDisplay = $('#whiteplayer').find('.time');
  this.blackDisplay = $('#blackplayer').find('.time');

  var clockInterval = null;
  this.showTime = function() {
    this.whiteDisplay.text(this.whiteTimer.formattedTime());
    this.blackDisplay.text(this.blackTimer.formattedTime());

    if (this.whiteTimer.time() === 0 || this.blackTimer.time() === 0)
      channel.trigger('game_over');
  };
  this.start = function() {
    if (clockInterval === null) {
      clockInterval = setInterval(this.showTime.bind(this), 100);
      this.whiteTimer.start();
    }
  };
  this.stop = function() {
    if (clockInterval !== null) {
      clearInterval(clockInterval);
      this.whiteTimer.stop();
      this.blackTimer.stop();
    }
    clockInterval = null;
  };

  this.setOrientation(data.color);
  this.setPlayerInfo(data);
}

ChessClock.prototype = {
  setOrientation: function(color) {
    var sideboard = $('#sideboard');
    var buffer = sideboard.find('.buffer');
    var white = sideboard.find('#whiteplayer');
    var black = sideboard.find('#blackplayer');
    if (color === 'white') {
      buffer.before(black).after(white);
    } else {
      buffer.before(white).after(black);
    }
  },

  setPlayerInfo: function(info) {
    $('#whiteplayer').find('.name').text(info.white_name);
    $('#blackplayer').find('.name').text(info.black_name);
  },

  toggleTimers: function(turn) {
    if (turn === 'w') {
      this.blackTimer.stop();
      this.whiteTimer.start();
    } else {
      this.whiteTimer.stop();
      this.blackTimer.start();
    }
  },

  syncTimers: function(data) {
    this.whiteTimer.sync(data.white);
    this.blackTimer.sync(data.black);
  },

  timeData: function() {
    return {white: this.whiteTimer.time(),
            black: this.blackTimer.time()};
  }
};
