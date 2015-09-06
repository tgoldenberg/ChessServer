class GameLogController < WebsocketRails::BaseController
  def initialize_session
    controller_store[:live_games] = []
  end
  
  def start_game
   unless has_channel?(message[:channel_name])
    live_games << message 
    broadcast_message :live_games, top_games
   end
  end
  
  def save_game
    channel_name = message[:channel_name]
    if has_channel?(channel_name)
      live_games.delete_if { |game| game[:channel_name] == channel_name }
      Game.create(message[:game])
      broadcast_message :live_games, top_games
    end
  end
  
  private
  
    def live_games
      controller_store[:live_games]
    end
    
    def has_channel?(channel_name)
      live_games.any? { |game| game[:channel_name] == channel_name }
    end
    
    def top_games
      live_games.first(3)
    end
end