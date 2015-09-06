class AddResultToGames < ActiveRecord::Migration
  def change
    add_column :games, :result, :string
  end
end
