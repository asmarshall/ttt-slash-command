
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(table){
          table.increments(); // id serial primary key
          table.string('channel_id');
          table.string('owner_mark_x');
          table.string('owner_mark_0');
          table.text('board');
          table.text('notes');
          table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
