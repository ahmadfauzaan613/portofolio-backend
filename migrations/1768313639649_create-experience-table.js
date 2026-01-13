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
  pgm.createTable('experiences', {
    id: 'id',
    company: { type: 'varchar(150)', notNull: true },
    role: { type: 'varchar(100)', notNull: true },
    description: { type: 'text' },
    location: { type: 'varchar(100)' },
    start_date: { type: 'date', notNull: true },
    end_date: { type: 'date' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  pgm.createIndex('experiences', 'company')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => {
  pgm.dropTable('experiences')
}
