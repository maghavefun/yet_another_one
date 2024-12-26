/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.schema.withSchema('public').createTable('users', (table) => {
		table.increments('id').primary();
		table.string('username', 255).notNullable().unique();
		table.string('email', 255).notNullable().unique();
		table.timestamp('create_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('users');
};
