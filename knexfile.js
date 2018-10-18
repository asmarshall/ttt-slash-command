require('dotenv').config();

module.exports = {

  development: {
      client: 'pg',
      connection: {
          database: 'ttt-db'
      },
      migrations: {
           directory: __dirname + '/db/migrations',
       },
      debug: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/db/migrations',
    }
  }
};
