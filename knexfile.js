require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });

module.exports = {

  development: {
      client: 'pg',
      connection: {
          database: 'ttt-db'
      },
      debug: true
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
