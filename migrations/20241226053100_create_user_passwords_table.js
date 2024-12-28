/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.schema.createTable('user_passwords', (table) => {
		table.increments('id').primary();
		table.integer('user_id').unsigned().notNullable();
		table.string('password_hash', 255).notNullable();
		table
			.foreign('user_id')
			.references('id')
			.inTable('users')
			.onDelete('CASCADE');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
	await knex.schema.dropTableIfExists('user_passwords');
};
