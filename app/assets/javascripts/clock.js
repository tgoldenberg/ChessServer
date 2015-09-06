/*
  data: color, time_control, white_name, black_name
  timesUp: callback to call if time runs out

  sideboard must be structured like so--
    <div id="sideboard">
      <div id="blackplayer">
        <div class="name"></div>
        <div class="time"></div>
      </div>
      <div class="buffer"></div>
      <div id="whiteplayer">
        <div class="name"></div>
        <div class="time"></div>
      </div>
    </div>
*/

function ChessClock(data, timesUp) {
  // data: color, time_control, white_name, black_name
  this.whiteTimer = new Timer(data.time_control);
  this.blackTimer = new Timer(data.time_control);
  this.whiteDisplay = $('#whiteplayer').find('.time');
  this.blackDisplay = $('#blackplayer').find('.time');
  this.clockInterval = null;
  this.timesUp = timesUp;

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
  },

  showTime: function() {
    this.whiteDisplay.text(this.whiteTimer.formattedTime());
    this.blackDisplay.text(this.blackTimer.formattedTime());

    if (this.flagged())
      this.timesUp();
  },

  start: function() {
    if (this.clockInterval === null) {
      this.clockInterval = setInterval(this.showTime.bind(this), 100);
      this.whiteTimer.start();
    }
  },

  stop: function() {
    if (this.clockInterval !== null) {
      clearInterval(this.clockInterval);
      this.whiteTimer.stop();
      this.blackTimer.stop();
    }
    this.clockInterval = null;
  },
  
  flagged: function() {
    return this.whiteTimer.time() === 0 || this.blackTimer.time() === 0;  
  },
  
  winner: function() {
    if (this.whiteTimer.time() === 0) {
      return 'b';  
    } else if (this.blackTimer.time() === 0) {
      return 'w';
    }  
  }
};
