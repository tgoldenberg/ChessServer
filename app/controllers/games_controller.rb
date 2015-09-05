class GamesController < ApplicationController
  before_action :authenticate_user!
  
  def new
  end
  
  def create
    Game.create(game_params)
    render nothing: true
  end
  
  private
  
    def game_params
      params.require(:game).permit(:white_id, :black_id, :pgn)
    end
end
