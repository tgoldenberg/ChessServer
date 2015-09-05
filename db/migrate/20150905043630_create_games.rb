class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.references :white, index: true, foreign_key: true
      t.references :black, index: true, foreign_key: true
      t.string :pgn

      t.timestamps null: false
    end
  end
end
