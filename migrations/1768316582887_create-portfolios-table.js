/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = pgm => {
  pgm.createTable('portfolios', {
    id: 'id',
    image_banner: { type: 'varchar(255)', notNull: true },
    short_desc: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    link: { type: 'varchar(255)' },
    all_image: { type: 'jsonb', notNull: true, default: '[]' },
    logo: { type: 'jsonb', notNull: true, default: '[]' },
    category: { type: 'varchar(100)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createIndex('portfolios', 'category')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => pgm.dropTable('portfolios')
