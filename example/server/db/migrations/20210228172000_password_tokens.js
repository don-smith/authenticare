exports.up = (knex, Promise) => {
  return knex.schema.createTable('password_tokens', table => {
    table.increments('id')
    table.string('email')
    table.string('token')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('password_tokens')
}
