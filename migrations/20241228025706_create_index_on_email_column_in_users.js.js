/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.raw(`
			CREATE INDEX IF NOT EXISTS idx_users_email_btree ON users(email);
	 `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.raw('DROP INDEX IF EXISTS idx_users_email_btree');
};
