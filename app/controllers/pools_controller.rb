class PoolsController < WebsocketRails::BaseController
  def initialize_session
    controller_store[:pool] = []
  end
  
  def seek
    controller_store[:pool] << data[:user_id] unless controller_store[:pool].include?(data[:user_id])
    new_game if controller_store[:pool].length >= 2
  end
  
  def new_game
    white_id = controller_store[:pool].shift
    black_id = controller_store[:pool].shift
    channel_name = 'w' + white_id.to_s + 'b' + black_id.to_s
    white_name = User.find(white_id).name
    black_name = User.find(black_id).name
    
    data = {
      white_id: white_id,
      black_id: black_id,
      time_control: 5,
      channel_name: channel_name,
      white_name: white_name,
      black_name: black_name
    }
    
    WebsocketRails.users[white_id].send_message('new_game', data)
    WebsocketRails.users[black_id].send_message('new_game', data)
  end
end