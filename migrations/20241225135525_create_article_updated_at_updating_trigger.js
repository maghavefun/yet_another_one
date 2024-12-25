/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.raw(`
			CREATE TRIGGER update_article_updated_at_timestamp
			BEFORE UPDATE ON articles
			FOR EACH ROW
			EXECUTE FUNCTION update_updated_at();
	 `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.raw(`
		DROP TRIGGER IF EXISTS update_article_updated_at_timestamp
		ON articles`);
};
