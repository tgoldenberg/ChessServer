class PoolsController < WebsocketRails::BaseController
  def initialize_session
    controller_store[:pool] = []
  end
  
  def seek
    controller_store[:pool] << data[:user_id] unless controller_store[:pool].include?(data[:user_id])
    new_game if controller_store[:pool].length >= 2
  end
  
  def new_game
  end
end