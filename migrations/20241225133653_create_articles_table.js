/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.withSchema('public')
		.createTable('articles', function (table) {
			table.increments('id').primary();
			table.string('title').notNullable();
			table.text('content').notNullable();
			table.jsonb('tags').notNullable().defaultTo('[]');
			table.enu('visibility', ['public', 'internal']).notNullable();
			table.timestamp('create_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at'.defaultTo(knex.fn.now()));
			// Parameter that shows if article is deleted(logically)
			table.boolean('deleted').defaultTo(false);
		});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists('articles');
};
