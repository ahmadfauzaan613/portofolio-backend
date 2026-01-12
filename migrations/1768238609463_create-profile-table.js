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
  // Create Profiles Table
  pgm.createTable('profiles', {
    id: 'id', // Shortcut for SERIAL PRIMARY KEY
    role: { type: 'varchar(100)', notNull: true },
    about: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  // Create Profile Links Table
  pgm.createTable('profile_links', {
    id: 'id',
    profile_id: {
      type: 'integer',
      notNull: true,
      references: '"profiles"',
      onDelete: 'CASCADE',
    },
    type: { type: 'varchar(50)', notNull: true },
    value: { type: 'text', notNull: true },
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
  pgm.dropTable('profile_links')
  pgm.dropTable('profiles')
}
