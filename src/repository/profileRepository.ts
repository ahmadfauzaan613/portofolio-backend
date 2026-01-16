import pool from '../config/database'
import { ProfileLink } from '../models/Profile'

export const findById = async (id: number) => {
  const res = await pool.query('SELECT * FROM profiles WHERE id = $1', [id])
  return res.rows[0]
}

export const findLatest = async () => {
  const res = await pool.query('SELECT * FROM profiles ORDER BY id DESC LIMIT 1')
  return res.rows[0]
}

export const findLinksByProfileId = async (profileId: number) => {
  const res = await pool.query('SELECT type, value FROM profile_links WHERE profile_id = $1', [
    profileId,
  ])
  return res.rows
}

export const saveProfile = async (role: string, about: string) => {
  const res = await pool.query('INSERT INTO profiles (role, about) VALUES ($1, $2) RETURNING id', [
    role,
    about,
  ])
  return res.rows[0].id
}

export const saveLinks = async (profileId: number, links: ProfileLink[]) => {
  const promises = links.map(link =>
    pool.query('INSERT INTO profile_links (profile_id, type, value) VALUES ($1, $2, $3)', [
      profileId,
      link.type,
      link.value,
    ])
  )
  return Promise.all(promises)
}

export const updateLinks = async (profileId: number, links: ProfileLink[]) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query('DELETE FROM profile_links WHERE profile_id = $1', [profileId])

    if (links && links.length > 0) {
      const promises = links.map(link =>
        client.query('INSERT INTO profile_links (profile_id, type, value) VALUES ($1, $2, $3)', [
          profileId,
          link.type,
          link.value,
        ])
      )
      await Promise.all(promises)
    }

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export const updateProfile = async (id: number, role: string, about: string) => {
  const res = await pool.query(
    'UPDATE profiles SET role = $1, about = $2 WHERE id = $3 RETURNING *',
    [role, about, id]
  )
  return res.rows[0]
}

export const deleteProfile = async (id: number) => {
  const res = await pool.query('DELETE FROM profiles WHERE id = $1 RETURNING *', [id])
  return res.rows[0]
}
