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
  pgm.createTable('api_logs', {
    id: 'id',
    method: { type: 'varchar(10)', notNull: true },
    path: { type: 'text', notNull: true },
    status_code: { type: 'integer', notNull: true },
    ip_address: { type: 'varchar(50)' },
    user_agent: { type: 'text' },
    execution_time: { type: 'varchar(20)' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => {
  pgm.dropTable('api_logs')
}
