import Knex from "knex"

export async function up(knex: Knex){
  return knex.schema.createTable("point_items", table => {
    table.increments("id").primary()
    // Cria uma chave estrangeira para referenciar um campo de uma tabela a outra. Chamado Realcionamento
    table.integer("point_id")
      .notNullable()
      .references("id") // Campo
      .inTable("points") // Table
    table.integer("item_id")
      .notNullable()
      .references("id") // Campo
      .inTable("items") // Table
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point_items")
}