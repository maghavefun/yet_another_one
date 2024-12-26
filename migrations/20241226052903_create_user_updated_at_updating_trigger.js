/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	return await knex.raw(`
			CREATE TRIGGER update_user_updated_at_timestamp
			BEFORE UPDATE ON users
			FOR EACH ROW
			EXECUTE FUNCTION update_updated_at();
	 `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
	return await knex.raw(`
		DROP TRIGGER IF EXISTS update_user_updated_at_timestamp
		ON articles`);
};
