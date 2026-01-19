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
  pgm.createTable('portfolio_images', {
    id: 'id',
    portfolio_id: {
      type: 'integer',
      notNull: true,
      references: '"portfolios"',
      onDelete: 'cascade',
    },
    type: {
      type: 'varchar(30)',
      notNull: true,
    },
    filename: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  })

  pgm.addConstraint(
    'portfolio_images',
    'portfolio_images_type_check',
    `CHECK (type IN ('all_image', 'logo'))`
  )

  pgm.createIndex('portfolio_images', 'portfolio_id')
  pgm.createIndex('portfolio_images', 'type')
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => {
  pgm.dropTable('portfolio_images')
}
