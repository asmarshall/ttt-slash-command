
exports.up = function(knex, Promise) {
  return knex.schema.table('games', table => {
    table.dropTimestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('games', table => {
    table.timestamps();
  })
};
