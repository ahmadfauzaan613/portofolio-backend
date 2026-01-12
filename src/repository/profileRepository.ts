import pool from '../config/database'
import { ProfileLink } from '../models/Profile'

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
