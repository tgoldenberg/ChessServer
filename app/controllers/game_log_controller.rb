class GameLogController < WebsocketRails::BaseController
  def initialize_session
    controller_store[:live_games] = {}
  end
  
  def new_game
    channel_name = data[:channel_name]
    unless live_games.has_key?(channel_name)
      live_games[channel_name] = data[:player_info]
    end
    broadcast_message :live_games, live_games 
  end
  
  private
  
    def live_games
      controller_store[:live_games]
    end
end