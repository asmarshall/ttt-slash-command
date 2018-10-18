require('dotenv');

module.exports = {

  development: {
      client: 'postgresql',
      connection: {
          database: 'ttt-db'
      },
      debug: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 0,
      max: 15
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 0,
      max: 15
    },
    migrations: {
      directory: './db/migrations'
    }
  }
};
