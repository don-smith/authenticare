const { generateHash } = require('authenticare/server')

exports.seed = (knex) => {
  return knex('users').del()
    .then(() => Promise.all([
      generateHash('jess'),
      generateHash('jules')
    ]))
    .then(([jessHash, julesHash]) =>
      knex('users').insert([
        { id: 1, username: 'jess', email: 'jess@email.com', hash: jessHash },
        { id: 2, username: 'jules', email: 'jules@email.com', hash: julesHash }
      ])
    )
}
