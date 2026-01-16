import bcrypt from 'bcrypt'
import pool from '../config/database'

const seedUser = async () => {
  const username = process.env.SUPERADMIN_USERNAME
  const plainPassword = process.env.SUPERADMIN_PASSWORD

  if (!username || !plainPassword) {
    console.error('❌ Error: SUPERADMIN_USERNAME atau SUPERADMIN_PASSWORD tidak ditemukan di .env')
    process.exit(1)
  }

  try {
    const checkUser = await pool.query('SELECT id FROM users WHERE username = $1', [username])

    if (checkUser.rows.length > 0) {
      console.log(`⚠️ Seeder skipped: User "${username}" sudah ada.`)
      process.exit(0)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(plainPassword, salt)

    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
      username,
      hashedPassword,
    ])

    console.log(`✅ Seeder Success: User "${username}" berhasil dibuat.`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeder Error:', error)
    process.exit(1)
  }
}
seedUser()
